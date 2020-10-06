import { animate, byId, click_once, err, wait } from './util'

class Path {
    private length = 0
    private len_since_split = 50

    constructor(
        private width: number,
        private height: number,
        private px = Math.random() * width,
        private py = 0,
        private direction = 0,
    ) {
    }

    split_off(): Path | null {
        if (this.len_since_split > 70 && Math.random() < 0.008) {
            const add_dir = Math.random() < 0.5 ? 10 : -10
            const path = new Path(this.width, this.height, this.px, this.py, this.direction + add_dir)
            path.len_since_split = this.len_since_split = 0
            return path
        } else {
            return null
        }
    }

    next(ctx: CanvasRenderingContext2D) {
        this.direction += Math.random() * 2 - 1
        this.length += 1
        this.len_since_split += 1

        ctx.moveTo(this.px, this.py)
        this.px += Math.sin(this.direction / 12) * devicePixelRatio * 1.2
        this.py += Math.cos(this.direction / 12) * devicePixelRatio * 1.2
        ctx.lineTo(this.px, this.py)

        const in_screen = this.px >= 0 && this.px <= this.width && this.py >= 0 && this.py <= this.height
        return in_screen && (this.length < 100 || Math.random() > 0.005)
    }
}

export async function start_screen() {
    const el = byId('start-screen')
    el.style.display = 'block'

    const btn = byId('start-btn')

    const canvas = byId('start-canvas', HTMLCanvasElement)
    const size = canvas.getBoundingClientRect()
    canvas.width = Math.round(size.width * devicePixelRatio)
    canvas.height = Math.round(size.height * devicePixelRatio)

    const ctx = canvas.getContext('2d') ?? err('Canvas not supported')
    ctx.strokeStyle = '#eeaa33'
    ctx.lineWidth = 1.2 * devicePixelRatio

    let paths: Path[] = []
    let start_paths: Path[] = []
    let remaining = size.width * size.height / 20

    const animation = animate(() => {
        if (paths.length < 7 && remaining > 0) {
            paths.push(start_paths.shift() ?? new Path(canvas.width, canvas.height))
        }
        paths = paths.filter(path => {
            remaining -= 1
            const s = path.split_off()
            if (s != null) {
                start_paths.push(s)
            }
            return path.next(ctx)
        })

        ctx.stroke()
        if (paths.length === 0) animation.pause()
    })

    await wait(300)
    btn.style.opacity = '1'
    await wait(300)
    await click_once(btn)

    animation.pause()
    btn.style.opacity = '0'
    el.style.display = ''
}
