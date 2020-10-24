export function err(msg?: string): never {
    throw new Error(msg)
}

export function wait(ms: number): Promise<undefined> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export function resolvable_promise(): Promise<undefined> & { resolve(): void } {
    let resolve_: (() => void) | null = null
    const p: any = new Promise(resolve => resolve_ = resolve)
    p.resolve = resolve_
    return p
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
