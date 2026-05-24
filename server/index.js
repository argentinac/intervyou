import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { existsSync, readFileSync } from 'fs'
const __dirname = dirname(fileURLToPath(import.meta.url))

import dotenv from 'dotenv'
dotenv.config({ path: resolve(__dirname, '../.env'), override: true })

import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { rateLimit } from 'express-rate-limit'
import { transcribeRoute } from './routes/transcribe.js'
import { chatRoute } from './routes/chat.js'
import { speakRoute } from './routes/speak.js'
import { interviewsRouter } from './routes/interviews.js'
import { logsRouter } from './routes/logs.js'
import { paymentsRouter } from './routes/payments.js'
import { generateSetupRoute } from './routes/generateSetup.js'

const app = express()
const upload = multer({ storage: multer.memoryStorage() })

app.use(cors())
app.use(express.json())

// 60 requests/min per IP — ~1 req/s, enough for a full interview turn
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'rate_limit', message: 'Too many requests, please slow down.' },
})

// 120 requests/min per IP — speak is called more often (each AI turn + skill audio)
const speakLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'rate_limit', message: 'Too many requests, please slow down.' },
})

app.post('/api/transcribe', upload.single('audio'), transcribeRoute)
app.post('/api/chat', chatLimiter, chatRoute)
app.post('/api/speak', speakLimiter, speakRoute)
app.use('/api/interviews', interviewsRouter)
app.use('/api/logs', logsRouter)
app.use('/api/payments', paymentsRouter)
app.post('/api/generate-setup', generateSetupRoute)

// Serve frontend in production
const clientDist = resolve(process.cwd(), 'client/dist')
const clientPublic = resolve(process.cwd(), 'client/public')
console.log('client/dist path:', clientDist, '| exists:', existsSync(clientDist))
app.use(express.static(clientDist))

app.get('/sitemap.xml', (_, res) => {
  const path = existsSync(resolve(clientDist, 'sitemap.xml'))
    ? resolve(clientDist, 'sitemap.xml')
    : resolve(clientPublic, 'sitemap.xml')
  res.setHeader('Content-Type', 'application/xml')
  res.send(readFileSync(path, 'utf-8'))
})

app.get('/robots.txt', (_, res) => {
  const path = existsSync(resolve(clientDist, 'robots.txt'))
    ? resolve(clientDist, 'robots.txt')
    : resolve(clientPublic, 'robots.txt')
  res.setHeader('Content-Type', 'text/plain')
  res.send(readFileSync(path, 'utf-8'))
})

app.get('*', (_, res) => {
  const indexPath = resolve(clientDist, 'index.html')
  if (existsSync(indexPath)) {
    res.sendFile(indexPath)
  } else {
    res.status(200).send('Frontend not built. Run npm run build first.')
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`))
