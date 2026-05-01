import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'
const __dirname = dirname(fileURLToPath(import.meta.url))

import dotenv from 'dotenv'
dotenv.config({ path: resolve(__dirname, '../.env'), override: true })

import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { transcribeRoute } from './routes/transcribe.js'
import { chatRoute } from './routes/chat.js'
import { speakRoute } from './routes/speak.js'
import { interviewsRouter } from './routes/interviews.js'
import { logsRouter } from './routes/logs.js'

const app = express()
const upload = multer({ storage: multer.memoryStorage() })

app.use(cors())
app.use(express.json())

app.post('/api/transcribe', upload.single('audio'), transcribeRoute)
app.post('/api/chat', chatRoute)
app.post('/api/speak', speakRoute)
app.use('/api/interviews', interviewsRouter)
app.use('/api/logs', logsRouter)

// Serve frontend in production
const clientDist = resolve(process.cwd(), 'client/dist')
console.log('client/dist path:', clientDist, '| exists:', existsSync(clientDist))
app.use(express.static(clientDist))
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
