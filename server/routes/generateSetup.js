import Anthropic from '@anthropic-ai/sdk'

const SYSTEM = `Sos un asistente que ayuda a personalizar simulaciones de práctica conversacional.
Respondé SIEMPRE con JSON válido, sin markdown, sin explicaciones.`

export async function generateSetupRoute(req, res) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set' })

  const { situation } = req.body
  if (!situation || situation.trim().length < 4) {
    return res.status(400).json({ error: 'too_short' })
  }

  const prompt = `El usuario quiere practicar esta situación: "${situation.trim()}"

Generá:
1. Un personaje/interlocutor adaptado (ej: "dar mala noticia a un cliente" → el interlocutor ES el cliente)
2. 2 o 3 preguntas de opción múltiple para personalizar el contexto

Respondé SOLO con este JSON:
{
  "persona": {
    "role": "Título breve del rol (ej: Cliente enojado, Jefe directo, Colega)",
    "gender": "male",
    "voiceTone": "neutral",
    "systemPromptCore": "3-4 oraciones en español, segunda persona singular, describiendo quién sos y cómo te comportás en esta situación específica. Empezá con 'Sos...'"
  },
  "questions": [
    {
      "id": "q1",
      "label": "Pregunta breve y específica sobre el contexto",
      "type": "select",
      "options": [
        { "value": "a", "label": "Opción concreta" },
        { "value": "b", "label": "Opción concreta" },
        { "value": "c", "label": "Opción concreta" },
        { "value": "other", "label": "Otra" }
      ]
    }
  ]
}

REGLAS ESTRICTAS:
- 2 o 3 preguntas, nunca más
- Cada pregunta: 3 opciones concretas + siempre "Otra" al final
- Para situaciones donde tiene sentido múltiple elección, usá type "multiselect" con campo "max": 2
- El systemPromptCore en español, persona que SE ADAPTA a lo que el usuario practique
- voiceTone debe ser uno de: "formal" (trabajo/trámites, tono neutro), "conflict" (confrontación, tensión, enojo), "personal" (familia, pareja, amigos, emocional), "neutral" (resto)
- Solo JSON válido, sin texto extra`

  const anthropic = new Anthropic({ apiKey })

  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 900,
      system: SYSTEM,
      messages: [{ role: 'user', content: prompt }],
    })

    let raw = response.content[0].text.trim()
    // Strip markdown code fences if present
    raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
    const parsed = JSON.parse(raw)

    if (!parsed.persona || !Array.isArray(parsed.questions)) {
      throw new Error('invalid structure')
    }

    res.json(parsed)
  } catch (err) {
    console.error('generateSetup error:', err.message)
    res.status(500).json({ error: 'generate_failed' })
  }
}
