import { OpenAI, toFile } from 'openai'

const LANGUAGE_CODES = {
  English: 'en', Spanish: 'es', French: 'fr',
  German: 'de', Portuguese: 'pt', Italian: 'it',
}

export async function transcribeRoute(req, res) {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const language = req.body?.language || 'English'
    const file = await toFile(req.file.buffer, 'recording.webm', {
      type: req.file.mimetype || 'audio/webm',
    })
    const transcription = await openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
      language: LANGUAGE_CODES[language] || 'en',
    })
    res.json({ text: transcription.text })
  } catch (err) {
    console.error('Transcribe error:', err)
    res.status(500).json({ error: err.message })
  }
}
