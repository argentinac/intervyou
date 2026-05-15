// Per-simulation voice overrides by gender
const SIMULATION_VOICE = {
  primera_cita: { male: '1ZPQohMlEcajpu7Yqpu9', female: 'UhYEfL4WY9ayH55DPdzF' },
}

// Premade ElevenLabs voices by gender (official, non-community)
const GENDER_VOICE = {
  female: 'XB0fDUnXU5powFXDhCwa', // Charlotte — multilingual, handles Spanish naturally
  male:   'ErXwobaYiN019PkySvjV',  // Antoni   — warm, works well across languages
}

// Language-specific voice overrides per gender. If a gender is missing here,
// the lookup falls through to GENDER_VOICE (Antoni for male, Charlotte for
// female) — both are multilingual and handle Spanish naturally.
const LANGUAGE_VOICE = {
  Spanish: { female: 'tRERXWzrPzFTtdfQUUbb', male: 'G3TxN1DDxQ8O3c1BV6ZK' },
}

const COUNTRY_VOICE_OVERRIDE = {}

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

const VOICE_TONE_SETTINGS = {
  formal:   { stability: 0.45, style: 0.30 }, // profesional, contenido
  conflict: { stability: 0.15, style: 0.80 }, // tenso, emotivo
  personal: { stability: 0.28, style: 0.62 }, // cálido, natural
  neutral:  { stability: 0.22, style: 0.60 }, // default
}

export async function speakRoute(req, res) {
  try {
    const { text, language, country, gender = 'female', simulationId, isSkill = false, voiceTone = null } = req.body
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Text is required' })
    }
    // Strip stage directions before sending to TTS: (acotación), [acotación], *acotación*
    const cleanText = text
      .replace(/\([^)]*\)/g, '')
      .replace(/\[[^\]]*\]/g, '')
      .replace(/\*[^*]+\*/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim()
    if (!cleanText) return res.status(400).json({ error: 'Text is empty after cleaning' })
    // When a regional override doesn't define the requested gender,
    // return null so we fall through to the next override / generic
    // gender voice — never silently swap to the opposite gender.
    const pickByGender = (entry) => {
      if (!entry) return null
      if (typeof entry === 'string') return entry
      return entry[gender] || null
    }
    const voiceId = pickByGender(SIMULATION_VOICE[simulationId])
      || pickByGender(COUNTRY_VOICE_OVERRIDE[country])
      || (COUNTRY_VOICE[country] ? COUNTRY_VOICE[country](gender) : null)
      || pickByGender(LANGUAGE_VOICE[language])
      || GENDER_VOICE[gender]
      || GENDER_VOICE.female
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
          text: cleanText,
          model_id: 'eleven_flash_v2_5',
          language_code: languageCode,
          voice_settings: (() => {
            if (isSkill) return { stability: 0.22, similarity_boost: 0.75, style: 0.68, use_speaker_boost: true, speed: 0.98 }
            const tone = VOICE_TONE_SETTINGS[voiceTone] || VOICE_TONE_SETTINGS.neutral
            return { stability: tone.stability, similarity_boost: 0.75, style: tone.style, use_speaker_boost: true, speed: 1.00 }
          })(),
        }),
      }
    )

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`ElevenLabs error: ${errText}`)
    }

    const t6 = Date.now()
    const buffer = Buffer.from(await response.arrayBuffer())
    const tts_chars = cleanText.length
    const tts_cost_usd = tts_chars * 0.00018 // $0.18 per 1000 chars — ElevenLabs Turbo v2.5
    res.set('Content-Type', 'audio/mpeg')
    res.set('X-T5', String(t5))
    res.set('X-T6', String(t6))
    res.set('X-Chars', String(tts_chars))
    res.set('X-TTS-Cost', String(tts_cost_usd))
    res.set('Access-Control-Expose-Headers', 'X-T5, X-T6, X-Chars, X-TTS-Cost')
    res.send(buffer)
  } catch (err) {
    console.error('Speak error:', err)
    res.status(500).json({ error: err.message })
  }
}
