# CoachToWork (prepai) — contexto para Claude

## Flujo de trabajo
1. Cambios siempre en una rama separada
2. Crear el PR inmediatamente (no esperar aprobación)
3. Levantar server local: `npm run dev` desde la raíz → cliente en localhost:5173+ y server en :3001
4. El usuario prueba en local y aprueba o rechaza
5. Merge a `main` solo cuando el usuario da el OK → auto-deploy a prod

## Stack
- Frontend: React + Vite (`client/`)
- Backend: Express (`server/`)
- Auth + DB: Supabase
- TTS: ElevenLabs (`server/routes/speak.js`)
- LLM: Anthropic Claude (`server/routes/chat.js`)
- STT: Web Speech API (browser nativo, SpeechRecognition)
- Deploy: auto-deploy desde `main`

## Decisiones técnicas tomadas

### Audio / ElevenLabs
- `stability: 0.60` — evita titubeos (era 0.30)
- `style: 0.15` — mejora pronunciación de números (era 0.45)
- `speed: 1.05` — velocidad natural (máx permitido por ElevenLabs es 1.2)
- `model_id: eleven_turbo_v2_5`
- Voz española: `p18tR9wFA5Ng9WhfWI0o`

### Autoplay del browser
- Al tocar "Comenzar", `SetupForm.handleSubmit` llama `unlockAudio()` de `client/src/audioContext.js`
- Esto crea un AudioContext compartido y reproduce 1 sample silencioso dentro del gesto del usuario
- `speakElevenLabs` en InterviewSession usa ese mismo AudioContext (`getAudioContext()`) para decodificar y reproducir el audio de ElevenLabs
- **No usar `new Audio(url).play()`** — el browser lo bloquea por autoplay policy cuando la llamada ocurre segundos después del click

### Scores
- La DB guarda scores en escala 0-10
- El feedback de Claude genera score 0-1000 (FeedbackSummary lo muestra directamente)
- MyInterviews y MyProgress muestran el score de DB con `Math.round()` — sin decimales

### Logos de empresas
- `MyInterviews.jsx` tiene `KNOWN_DOMAINS` dict para empresas conocidas (GCBA → buenosaires.gob.ar, Tienda Nube → tiendanube.com, etc.)
- Fallback: Clearbit logo API → initials

### Micrófono
- El chequeo de permisos con `getUserMedia` fue eliminado de `SetupForm` (causaba ruido de mic on/off al iniciar)
- El SpeechRecognition maneja el error `not-allowed` directamente con mensaje al usuario

## Estructura clave
```
prepai/
  client/src/
    audioContext.js     → AudioContext compartido (unlock en Comenzar)
    components/
      SetupForm.jsx     → formulario pre-entrevista, llama unlockAudio() en submit
      InterviewSession.jsx → lógica de entrevista, usa getAudioContext() para TTS
      FeedbackSummary.jsx  → pantalla de feedback post-entrevista
      MyInterviews.jsx     → historial, renderBold(), downloadFeedback(), KNOWN_DOMAINS
      MyProgress.jsx       → gráfico de progreso
      Dashboard.jsx        → home, stats (single stat cuando hay 1 entrevista)
    index.css           → todos los estilos (prefijos: .db-*, .iv-*, .sf-*, .meet-*, .home-*, .prog-*)
  server/
    routes/
      speak.js    → ElevenLabs TTS
      chat.js     → Claude API
      interviews.js → CRUD entrevistas en Supabase
      transcribe.js → Whisper STT
  .claude/
    settings.json → permite Bash(*) sin prompts de autorización
```

## Demo bar
- Solo para `user.email === 'matiasabas@gmail.com'` en prod
- En dev siempre visible
- Simula 0 / 1 / 5 / 50 entrevistas

## Git / deploy
- Repo: `https://github.com/argentinac/intervyou`
- Push a `main` → prod automáticamente
- Cuenta GitHub: `argentinac`
