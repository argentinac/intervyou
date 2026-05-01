// Premade ElevenLabs voices by gender (official, non-community)
const GENDER_VOICE = {
  female: 'XB0fDUnXU5powFXDhCwa', // Charlotte — multilingual, handles Spanish naturally
  male:   'ErXwobaYiN019PkySvjV',  // Antoni   — warm, works well across languages
}

// Language-specific voice overrides (applied before generic gender fallback)
const LANGUAGE_VOICE = {
  Spanish: 'p18tR9wFA5Ng9WhfWI0o', // always female for Spanish
}

// Country overrides for English speakers (premade voices)
const COUNTRY_VOICE = {
  'United States':  (gender) => gender === 'male' ? 'TxGEqnHWrfWFTfGW9XjX' : 'XrExE9yKIg1WjnnlVkGX', // Josh / Matilda
  'United Kingdom': (gender) => gender === 'male' ? 'JBFqnCBsd6RMkjVDRZzb' : 'ThT5KcBeYPX3keUQqHPh', // George / Dorothy
  Australia:        (gender) => gender === 'male' ? 'TxGEqnHWrfWFTfGW9XjX' : 'XrExE9yKIg1WjnnlVkGX',
  Canada:           (gender) => gender === 'male' ? 'TxGEqnHWrfWFTfGW9XjX' : 'XrExE9yKIg1WjnnlVkGX',
}

const COUNTRY_LANG_CODE = {
  // Spanish
  Argentina: 'es', Mexico: 'es', Colombia: 'es', Chile: 'es',
  Peru: 'es', Venezuela: 'es', Uruguay: 'es', Paraguay: 'es',
  Bolivia: 'es', Ecuador: 'es', 'Costa Rica': 'es', Guatemala: 'es',
  Honduras: 'es', Nicaragua: 'es', Panama: 'es', 'El Salvador': 'es',
  'Dominican Republic': 'es', Spain: 'es',
  // English
  'United States': 'en', 'United Kingdom': 'en', Australia: 'en',
  Canada: 'en', Ireland: 'en', 'New Zealand': 'en',
  // Portuguese
  Brazil: 'pt', Portugal: 'pt',
  // French
  France: 'fr', Belgium: 'fr', Switzerland: 'fr',
  // German
  Germany: 'de', Austria: 'de',
  // Italian
  Italy: 'it',
}

const LANG_CODE_FALLBACK = {
  English: 'en', Spanish: 'es', Portuguese: 'pt',
  French: 'fr', German: 'de', Italian: 'it',
}

export async function speakRoute(req, res) {
  try {
    const { text, language, country, gender = 'female' } = req.body
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Text is required' })
    }
    const voiceId = COUNTRY_VOICE[country]
      ? COUNTRY_VOICE[country](gender)
      : (LANGUAGE_VOICE[language] || GENDER_VOICE[gender] || GENDER_VOICE.female)
    const languageCode = COUNTRY_LANG_CODE[country] || LANG_CODE_FALLBACK[language] || 'en'

    const t5 = Date.now()
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_turbo_v2_5',
          language_code: languageCode,
          voice_settings: {
            stability: 0.60,
            similarity_boost: 0.75,
            style: 0.15,
            use_speaker_boost: true,
            speed: 1.05,
          },
        }),
      }
    )

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`ElevenLabs error: ${errText}`)
    }

    const t6 = Date.now()
    const buffer = Buffer.from(await response.arrayBuffer())
    res.set('Content-Type', 'audio/mpeg')
    res.set('X-T5', String(t5))
    res.set('X-T6', String(t6))
    res.set('Access-Control-Expose-Headers', 'X-T5, X-T6')
    res.send(buffer)
  } catch (err) {
    console.error('Speak error:', err)
    res.status(500).json({ error: err.message })
  }
}
