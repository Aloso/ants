export function byId<T extends HTMLElement>(id: string, ty?: new () => T): T {
    const el = document.getElementById(id) ?? err(`Element #${id} doesn't exist`)
    if (ty == null || el.constructor === ty) return el as T
    else err(`Element #${id} is not a ${ty.name}`)
}

export function err(msg?: string): never {
    throw new Error(msg)
}

export function click_once(elem: HTMLElement): Promise<MouseEvent> {
    return new Promise((resolve) => {
        const click = (e: MouseEvent) => {
            elem.removeEventListener('click', click)
            resolve(e)
        }
        elem.addEventListener('click', click)
    })
}

export function wait(ms: number): Promise<undefined> {
    return new Promise((resolve) => setTimeout(resolve, ms))
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
