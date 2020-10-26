export function err(msg?: string): never {
  throw new Error(msg)
}

export interface Animation {
  pause(): void
  resume(): void
}

export function animate(animation: () => void): Animation {
  let paused = false
  let running = true

  const loop = () => {
    animation()
    if (paused) running = false
    else requestAnimationFrame(loop)
  }
  requestAnimationFrame(loop)

  return {
    pause() {
      paused = true
    },
    resume() {
      paused = false
      if (!running) {
        running = true
        requestAnimationFrame(loop)
      }
    },
  }
}
