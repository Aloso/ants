import { StateUpdater, useState } from 'preact/hooks'

export function err(msg?: string): never {
  throw new Error(msg)
}

export type AddFunction<T> = (newValue: T) => T
export type RemoveFunction<T> = (remove: T) => T

export function useArrayState<T>(initial: T[]): [T[], AddFunction<T>, RemoveFunction<T>, StateUpdater<T[]>] {
  const [value, setState] = useState(initial)
  return [
    value,
    (newValue: T) => {
      setState(prev => [...prev, newValue])
      return newValue
    },
    (remove: T) => {
      setState(prev => prev.filter(value => value !== remove))
      return remove
    },
    setState,
  ]
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
