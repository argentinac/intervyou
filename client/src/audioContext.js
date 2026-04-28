let ctx = null

export function unlockAudio() {
  ctx = new (window.AudioContext || window.webkitAudioContext)()
  // Play a 1-sample silent buffer to unlock autoplay within the user gesture
  const buf = ctx.createBuffer(1, 1, 22050)
  const src = ctx.createBufferSource()
  src.buffer = buf
  src.connect(ctx.destination)
  src.start(0)
}

export function getAudioContext() {
  return ctx
}
