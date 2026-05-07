import express from 'express'
import crypto from 'crypto'
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'
import { requireAuth } from '../middleware/auth.js'
import { supabase } from '../lib/supabase.js'

export const paymentsRouter = express.Router()

// Countries that use Mercado Pago
const MP_COUNTRIES = new Set(['AR', 'BR', 'MX', 'CO', 'CL', 'PE', 'UY'])

const PRICES = {
  monthly:   { usd: parseFloat(process.env.PRICE_MONTHLY_USD  || '9.99'),  ars: parseFloat(process.env.PRICE_MONTHLY_ARS  || '9990') },
  quarterly: { usd: parseFloat(process.env.PRICE_QUARTERLY_USD || '14.99'), ars: parseFloat(process.env.PRICE_QUARTERLY_ARS || '14990') },
}

function getMPClient() {
  return new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN })
}

async function getCountryFromIP(ip) {
  try {
    const clean = ip?.split(',')[0].trim().replace(/^::ffff:/, '')
    if (!clean || clean === '127.0.0.1' || clean === '::1') return 'AR' // dev → AR para testear MP
    const res = await fetch(`http://ip-api.com/json/${clean}?fields=countryCode`)
    const data = await res.json()
    return data.countryCode || 'US'
  } catch {
    return 'US'
  }
}

function getClientIP(req) {
  return req.headers['x-forwarded-for'] || req.socket.remoteAddress || ''
}

// GET /api/payments/country — frontend consulta cuál procesador usar
paymentsRouter.get('/country', async (req, res) => {
  const country = await getCountryFromIP(getClientIP(req))
  res.json({ country, processor: MP_COUNTRIES.has(country) ? 'mercadopago' : 'lemonsqueezy' })
})

// GET /api/payments/subscription — estado actual del plan del usuario
paymentsRouter.get('/subscription', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('plan, plan_status, plan_period, plan_expires_at, payment_provider')
    .eq('id', req.user.id)
    .single()

  if (error) return res.status(500).json({ error: error.message })

  const now = new Date()
  let plan = data.plan || 'free'
  let planStatus = data.plan_status || 'active'

  // Si expiró (para pagos MP one-time), degradar a free
  if (plan === 'pro' && data.plan_expires_at && new Date(data.plan_expires_at) < now) {
    plan = 'free'
    planStatus = 'canceled'
    await supabase.from('profiles').update({ plan: 'free', plan_status: 'canceled' }).eq('id', req.user.id)
  }

  res.json({ plan, planStatus, planPeriod: data.plan_period, planExpiresAt: data.plan_expires_at, provider: data.payment_provider })
})

// POST /api/payments/checkout — crea sesión de pago
paymentsRouter.post('/checkout', requireAuth, async (req, res) => {
  const { period } = req.body
  if (!['monthly', 'quarterly'].includes(period)) return res.status(400).json({ error: 'period inválido' })

  const userId = req.user.id
  const userEmail = req.user.email
  const country = await getCountryFromIP(getClientIP(req))
  const useMP = MP_COUNTRIES.has(country)
  const appUrl = process.env.APP_URL || 'https://coachtowork.io'
  const serverUrl = process.env.SERVER_URL || appUrl

  if (useMP) {
    if (!process.env.MP_ACCESS_TOKEN) return res.status(503).json({ error: 'Mercado Pago no configurado' })

    const price = PRICES[period]
    const label = period === 'monthly' ? 'Plan Pro Mensual' : 'Plan Pro Trimestral'

    const preference = new Preference(getMPClient())
    const result = await preference.create({
      body: {
        items: [{ title: `CoachToWork ${label}`, quantity: 1, unit_price: price.ars, currency_id: 'ARS' }],
        payer: { email: userEmail },
        external_reference: `${userId}:${period}`,
        back_urls: {
          success: `${appUrl}/payment-success`,
          failure: `${appUrl}/payment-error`,
          pending: `${appUrl}/payment-success`,
        },
        auto_return: 'approved',
        notification_url: `${serverUrl}/api/payments/webhooks/mercadopago`,
      },
    })

    const url = process.env.MP_SANDBOX === 'true' ? result.sandbox_init_point : result.init_point
    return res.json({ url, processor: 'mercadopago' })
  } else {
    if (!process.env.LS_API_KEY) return res.status(503).json({ error: 'Lemon Squeezy no configurado' })

    const variantId = period === 'monthly' ? process.env.LS_VARIANT_MONTHLY : process.env.LS_VARIANT_QUARTERLY
    if (!variantId) return res.status(503).json({ error: `LS_VARIANT_${period.toUpperCase()} no configurado` })

    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.LS_API_KEY}`,
        'Content-Type': 'application/vnd.api+json',
        Accept: 'application/vnd.api+json',
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              email: userEmail,
              custom: { user_id: userId, period },
            },
            product_options: {
              redirect_url: `${appUrl}/payment-success`,
            },
          },
          relationships: {
            store: { data: { type: 'stores', id: process.env.LS_STORE_ID } },
            variant: { data: { type: 'variants', id: String(variantId) } },
          },
        },
      }),
    })

    const data = await response.json()
    const url = data?.data?.attributes?.url
    if (!url) {
      console.error('LS checkout error:', JSON.stringify(data))
      return res.status(500).json({ error: 'No se pudo crear el checkout de Lemon Squeezy' })
    }
    return res.json({ url, processor: 'lemonsqueezy' })
  }
})

// POST /api/payments/webhooks/mercadopago
paymentsRouter.post('/webhooks/mercadopago', express.raw({ type: 'application/json' }), async (req, res) => {
  // Verificar firma si está configurada
  const secret = process.env.MP_WEBHOOK_SECRET
  if (secret) {
    const xSignature = req.headers['x-signature'] || ''
    const xRequestId = req.headers['x-request-id'] || ''
    const urlParams = new URLSearchParams(req.url.split('?')[1] || '')
    const dataId = urlParams.get('data.id') || ''
    const manifest = `id:${dataId};request-id:${xRequestId};ts:${xSignature.split(',').find(p => p.startsWith('ts='))?.split('=')[1] || ''};`
    const expected = crypto.createHmac('sha256', secret).update(manifest).digest('hex')
    const received = xSignature.split(',').find(p => p.startsWith('v1='))?.split('=')[1] || ''
    if (received && expected !== received) return res.status(401).send('Invalid signature')
  }

  const body = JSON.parse(req.body.toString())
  res.sendStatus(200) // MP necesita 200 rápido

  if (body.type !== 'payment' || !body.data?.id) return

  try {
    const payment = new Payment(getMPClient())
    const paymentData = await payment.get({ id: body.data.id })

    if (paymentData.status !== 'approved') return

    const [userId, period] = (paymentData.external_reference || '').split(':')
    if (!userId || !period) return

    const daysToAdd = period === 'quarterly' ? 90 : 30
    const expiresAt = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000).toISOString()

    await supabase.from('profiles').update({
      plan: 'pro',
      plan_status: 'active',
      plan_period: period,
      plan_expires_at: expiresAt,
      payment_provider: 'mercadopago',
      provider_subscription_id: String(paymentData.id),
      provider_customer_id: String(paymentData.payer?.id || ''),
    }).eq('id', userId)
  } catch (err) {
    console.error('MP webhook error:', err)
  }
})

// POST /api/payments/webhooks/lemon
paymentsRouter.post('/webhooks/lemon', express.raw({ type: '*/*' }), async (req, res) => {
  // Verificar firma
  const secret = process.env.LS_WEBHOOK_SECRET
  if (secret) {
    const signature = req.headers['x-signature']
    const expected = crypto.createHmac('sha256', secret).update(req.body).digest('hex')
    if (signature !== expected) return res.status(401).send('Invalid signature')
  }

  const body = JSON.parse(req.body.toString())
  res.sendStatus(200)

  const eventName = body.meta?.event_name
  const attrs = body.data?.attributes
  const customData = body.meta?.custom_data || {}

  // Eventos que activan el plan pro
  if (['order_created', 'subscription_created', 'subscription_payment_success'].includes(eventName)) {
    const userId = customData.user_id
    const period = customData.period || 'monthly'
    if (!userId) return

    const status = attrs?.status === 'active' ? 'active' : 'active'
    const subId = String(body.data?.id || '')
    const customerId = String(attrs?.customer_id || '')

    // Para subscriptions: no usamos expires_at fijo, LS maneja la renovación
    const updates = {
      plan: 'pro',
      plan_status: status,
      plan_period: period,
      plan_expires_at: attrs?.ends_at || null,
      payment_provider: 'lemonsqueezy',
      provider_subscription_id: subId,
      provider_customer_id: customerId,
    }

    await supabase.from('profiles').update(updates).eq('id', userId)
  }

  // Suscripción cancelada / suspendida
  if (['subscription_cancelled', 'subscription_expired', 'subscription_paused'].includes(eventName)) {
    const subId = String(body.data?.id || '')
    const statusMap = { subscription_cancelled: 'canceled', subscription_expired: 'canceled', subscription_paused: 'past_due' }
    const newStatus = statusMap[eventName]

    await supabase.from('profiles')
      .update({ plan_status: newStatus, ...(newStatus === 'canceled' ? { plan: 'free' } : {}) })
      .eq('provider_subscription_id', subId)
  }

  // Pago fallido
  if (eventName === 'subscription_payment_failed') {
    const subId = String(body.data?.id || '')
    await supabase.from('profiles').update({ plan_status: 'past_due' }).eq('provider_subscription_id', subId)
  }
})
