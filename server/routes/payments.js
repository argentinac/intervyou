import express from 'express'
import crypto from 'crypto'
import { MercadoPagoConfig, PreApprovalPlan, PreApproval, Payment } from 'mercadopago'
import { requireAuth } from '../middleware/auth.js'
import { supabase } from '../lib/supabase.js'

export const paymentsRouter = express.Router()

const MP_COUNTRIES = new Set(['AR', 'BR', 'MX', 'CO', 'CL', 'PE', 'UY'])

const PRICES_USD = {
  monthly:   parseFloat(process.env.PRICE_MONTHLY_USD   || '9.99'),
  quarterly: parseFloat(process.env.PRICE_QUARTERLY_USD || '14.99'),
}

// Cache del tipo de cambio oficial (5 minutos)
let usdArsCache = { rate: null, fetchedAt: 0 }

async function getOfficialUSDtoARS() {
  const now = Date.now()
  if (usdArsCache.rate && now - usdArsCache.fetchedAt < 5 * 60 * 1000) {
    return usdArsCache.rate
  }
  try {
    const res = await fetch('https://api.bluelytics.com.ar/v2/latest')
    const data = await res.json()
    const rate = data?.oficial?.value_sell
    if (!rate) throw new Error('Sin datos')
    usdArsCache = { rate, fetchedAt: now }
    return rate
  } catch {
    // Fallback: si falla la API, usar el último valor cacheado o un default
    return usdArsCache.rate || 1420
  }
}

async function usdToARS(usd) {
  const rate = await getOfficialUSDtoARS()
  const raw = usd * rate
  // Redondear para arriba a los 100s
  return Math.ceil(raw / 100) * 100
}

// Cache de planes MP: { id, init_point, price }
const mpPlanCache = { monthly: null, quarterly: null }

function getMPClient() {
  return new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN })
}

async function getCountryFromIP(ip) {
  try {
    const clean = ip?.split(',')[0].trim().replace(/^::ffff:/, '')
    if (!clean || clean === '127.0.0.1' || clean === '::1') return 'AR' // dev → testear MP
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

// Devuelve el init_point del plan MP (URL donde el usuario se suscribe).
// Crea un plan nuevo si no hay uno cacheado o si el precio cambió.
async function getMPPlanInitPoint(period, priceARS) {
  const cached = mpPlanCache[period]
  if (cached && cached.price === priceARS) return cached.init_point

  // Si hay ID guardado en env (plan pre-existente), obtenerlo de la API
  const envId = period === 'monthly' ? process.env.MP_PLAN_MONTHLY_ID : process.env.MP_PLAN_QUARTERLY_ID
  if (envId && (!cached || cached.price !== priceARS)) {
    const client = getMPClient()
    const planApi = new PreApprovalPlan(client)
    try {
      const plan = await planApi.get({ preApprovalPlanId: envId })
      if (plan?.init_point) {
        mpPlanCache[period] = { id: envId, init_point: plan.init_point, price: priceARS }
        return plan.init_point
      }
    } catch { /* plan no existe o expiró, crear uno nuevo */ }
  }

  const client = getMPClient()
  const planApi = new PreApprovalPlan(client)
  const appUrl = process.env.APP_URL || 'https://feelready.io'

  const configs = {
    monthly:   { reason: 'FeelReady Pro - Mensual',    auto_recurring: { frequency: 1, frequency_type: 'months', transaction_amount: priceARS, currency_id: 'ARS' } },
    quarterly: { reason: 'FeelReady Pro - Trimestral', auto_recurring: { frequency: 3, frequency_type: 'months', transaction_amount: priceARS, currency_id: 'ARS' } },
  }

  const result = await planApi.create({ body: { ...configs[period], back_url: `${appUrl}/payment-success` } })
  mpPlanCache[period] = { id: result.id, init_point: result.init_point, price: priceARS }
  console.log(`MP plan creado [${period}] a $${priceARS} ARS: ${result.id} → ${result.init_point}`)
  return result.init_point
}

// GET /api/payments/country
paymentsRouter.get('/country', async (req, res) => {
  const country = await getCountryFromIP(getClientIP(req))
  res.json({ country, processor: MP_COUNTRIES.has(country) ? 'mercadopago' : 'lemonsqueezy' })
})

// GET /api/payments/subscription
paymentsRouter.get('/subscription', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('plan, plan_status, plan_period, plan_expires_at, payment_provider')
    .eq('id', req.user.id)
    .single()

  if (error) return res.status(500).json({ error: error.message })

  res.json({
    plan: data.plan || 'free',
    planStatus: data.plan_status || 'active',
    planPeriod: data.plan_period,
    planExpiresAt: data.plan_expires_at,
    provider: data.payment_provider,
  })
})

// POST /api/payments/checkout
paymentsRouter.post('/checkout', requireAuth, async (req, res) => {
  const { period } = req.body
  if (!['monthly', 'quarterly'].includes(period)) return res.status(400).json({ error: 'period inválido' })

  const userId = req.user.id
  const userEmail = req.user.email
  const country = await getCountryFromIP(getClientIP(req))
  const useMP = MP_COUNTRIES.has(country)
  const appUrl = process.env.APP_URL || 'https://feelready.io'
  const serverUrl = process.env.SERVER_URL || appUrl

  if (useMP) {
    if (!process.env.MP_ACCESS_TOKEN) return res.status(503).json({ error: 'Mercado Pago no configurado' })

    try {
      const priceARS = await usdToARS(PRICES_USD[period])
      const planInitPoint = await getMPPlanInitPoint(period, priceARS)
      // Agregar external_reference y payer_email al init_point del plan para identificar al usuario en el webhook
      const url = new URL(planInitPoint)
      url.searchParams.set('external_reference', `${userId}:${period}`)
      if (userEmail) url.searchParams.set('payer_email', userEmail)
      return res.json({ url: url.toString(), processor: 'mercadopago' })
    } catch (err) {
      console.error('MP checkout error:', err)
      return res.status(500).json({ error: 'Error al crear suscripción en Mercado Pago' })
    }
  } else {
    if (!process.env.LS_API_KEY) return res.status(503).json({ error: 'Lemon Squeezy no configurado' })

    const variantId = period === 'monthly' ? process.env.LS_VARIANT_MONTHLY : process.env.LS_VARIANT_QUARTERLY
    if (!variantId) return res.status(503).json({ error: `LS_VARIANT_${period.toUpperCase()} no configurado` })

    try {
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
              product_options: { redirect_url: `${appUrl}/payment-success` },
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
        return res.status(500).json({ error: 'Error al crear checkout en Lemon Squeezy' })
      }
      return res.json({ url, processor: 'lemonsqueezy' })
    } catch (err) {
      console.error('LS checkout error:', err)
      return res.status(500).json({ error: 'Error al crear checkout en Lemon Squeezy' })
    }
  }
})

// POST /api/payments/webhooks/mercadopago
paymentsRouter.post('/webhooks/mercadopago', express.raw({ type: 'application/json' }), async (req, res) => {
  const secret = process.env.MP_WEBHOOK_SECRET
  if (secret) {
    const xSignature = req.headers['x-signature'] || ''
    const xRequestId = req.headers['x-request-id'] || ''
    const ts = xSignature.split(',').find(p => p.startsWith('ts='))?.split('=')[1] || ''
    const urlParams = new URLSearchParams(req.url.split('?')[1] || '')
    const dataId = urlParams.get('data.id') || ''
    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`
    const expected = crypto.createHmac('sha256', secret).update(manifest).digest('hex')
    const received = xSignature.split(',').find(p => p.startsWith('v1='))?.split('=')[1] || ''
    if (received && expected !== received) return res.status(401).send('Invalid signature')
  }

  let body
  try { body = JSON.parse(req.body.toString()) } catch { return res.sendStatus(400) }
  res.sendStatus(200)

  try {
    // Evento de pago aprobado dentro de una suscripción
    if (body.type === 'payment' && body.data?.id) {
      const payment = new Payment(getMPClient())
      const paymentData = await payment.get({ id: body.data.id })
      if (paymentData.status !== 'approved') return

      let [userId, period] = (paymentData.external_reference || '').split(':')

      // Fallback: buscar por email del pagador si no hay external_reference
      if (!userId && paymentData.payer?.email) {
        const { data: authUser } = await supabase.auth.admin.listUsers()
        const match = authUser?.users?.find(u => u.email === paymentData.payer.email)
        userId = match?.id
      }
      if (!userId) return

      await supabase.from('profiles').update({
        plan: 'pro',
        plan_status: 'active',
        plan_period: period || 'monthly',
        plan_expires_at: null, // MP maneja la renovación automática
        payment_provider: 'mercadopago',
        provider_subscription_id: String(paymentData.preapproval_id || ''),
        provider_customer_id: String(paymentData.payer?.id || ''),
      }).eq('id', userId)
    }

    // Evento de suscripción (cancelada, pausada, etc.)
    if (body.type === 'subscription_preapproval' && body.data?.id) {
      const client = getMPClient()
      const preApproval = new PreApproval(client)
      const sub = await preApproval.get({ id: body.data.id })
      let [userId] = (sub.external_reference || '').split(':')

      if (!userId && sub.payer_email) {
        const { data: authUser } = await supabase.auth.admin.listUsers()
        const match = authUser?.users?.find(u => u.email === sub.payer_email)
        userId = match?.id
      }
      if (!userId) return

      if (sub.status === 'cancelled' || sub.status === 'paused') {
        await supabase.from('profiles').update({
          plan: sub.status === 'cancelled' ? 'free' : 'pro',
          plan_status: sub.status === 'cancelled' ? 'canceled' : 'past_due',
        }).eq('id', userId)
      }
    }
  } catch (err) {
    console.error('MP webhook error:', err)
  }
})

// POST /api/payments/webhooks/lemon
paymentsRouter.post('/webhooks/lemon', express.raw({ type: '*/*' }), async (req, res) => {
  const secret = process.env.LS_WEBHOOK_SECRET
  if (secret) {
    const signature = req.headers['x-signature']
    const expected = crypto.createHmac('sha256', secret).update(req.body).digest('hex')
    if (signature !== expected) return res.status(401).send('Invalid signature')
  }

  let body
  try { body = JSON.parse(req.body.toString()) } catch { return res.sendStatus(400) }
  res.sendStatus(200)

  const eventName = body.meta?.event_name
  const attrs = body.data?.attributes
  const customData = body.meta?.custom_data || {}

  try {
    if (['order_created', 'subscription_created', 'subscription_payment_success'].includes(eventName)) {
      const userId = customData.user_id
      const period = customData.period || 'monthly'
      if (!userId) return

      await supabase.from('profiles').update({
        plan: 'pro',
        plan_status: 'active',
        plan_period: period,
        plan_expires_at: attrs?.ends_at || null,
        payment_provider: 'lemonsqueezy',
        provider_subscription_id: String(body.data?.id || ''),
        provider_customer_id: String(attrs?.customer_id || ''),
      }).eq('id', userId)
    }

    if (['subscription_cancelled', 'subscription_expired'].includes(eventName)) {
      await supabase.from('profiles')
        .update({ plan: 'free', plan_status: 'canceled' })
        .eq('provider_subscription_id', String(body.data?.id || ''))
    }

    if (eventName === 'subscription_paused') {
      await supabase.from('profiles')
        .update({ plan_status: 'past_due' })
        .eq('provider_subscription_id', String(body.data?.id || ''))
    }

    if (eventName === 'subscription_payment_failed') {
      await supabase.from('profiles')
        .update({ plan_status: 'past_due' })
        .eq('provider_subscription_id', String(body.data?.id || ''))
    }
  } catch (err) {
    console.error('LS webhook error:', err)
  }
})
