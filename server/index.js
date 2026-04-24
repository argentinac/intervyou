import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))

import dotenv from 'dotenv'
dotenv.config({ path: resolve(__dirname, '../.env'), override: true })

import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { transcribeRoute } from './routes/transcribe.js'
import { chatRoute } from './routes/chat.js'
import { speakRoute } from './routes/speak.js'

const app = express()
const upload = multer({ storage: multer.memoryStorage() })

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.post('/api/transcribe', upload.single('audio'), transcribeRoute)
app.post('/api/chat', chatRoute)
app.post('/api/speak', speakRoute)

const PORT = 3001
app.listen(PORT, () => console.log(`PrepAI server running on http://localhost:${PORT}`))
