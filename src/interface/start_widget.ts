import { Animation, animate, err, wait } from '../util'
import { click_once } from './node_util'
import { add_widget, remove_widget, Widget } from '../interface/widgets'
import { ConfirmWidget } from '../interface/confirm_widget'
import { AppState } from 'logic/app_state'

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

function node(txt: string): Element {
    const el = document.createElement('div')
    el.innerHTML = txt
    return el.children[0]
}

export class StartWidget implements Widget {
    private el = node(`
    <div class="widget start-widget">
        <canvas class="start-canvas"></canvas>
        <div class="centered">
            <h1>Ameisen</h1>
            <div>Ein Weihnachtsspiel</div>
            <button class='start-btn' style="opacity: 0;">Start</button><br><br>
            <button class='reset-btn' style="opacity: 0;">Spielstand zurücksetzen</button>
        </div>
    </div>`) as HTMLElement

    private btn = this.el.querySelector('button.start-btn') as HTMLElement
    private resetBtn = this.el.querySelector('button.reset-btn') as HTMLElement
    private animation?: Animation

    constructor(private readonly app_state: AppState) {
    }

    async show() {
        add_widget(this)
        document.body.append(this.el)

        const canvas = this.el.querySelector('canvas') as HTMLCanvasElement
        const size = canvas.getBoundingClientRect()
        canvas.width = Math.round(size.width * devicePixelRatio)
        canvas.height = Math.round(size.height * devicePixelRatio)

        const ctx = canvas.getContext('2d') ?? err('Canvas not supported')
        ctx.strokeStyle = '#eeaa33'
        ctx.lineWidth = 1.2 * devicePixelRatio

        let paths: Path[] = []
        let start_paths: Path[] = []
        let remaining = size.width * size.height / 20

        this.animation = animate(() => {
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
            if (paths.length === 0 && this.animation != null) this.animation.pause()
        })

        const has_started = this.app_state.name != null

        await wait(300)
        this.btn.style.opacity = '1'
        if (has_started) {
            this.resetBtn.style.opacity = '1'
        }

        await wait(300)
        if (has_started) {
            this.resetBtn.addEventListener('click', () => {
                new ConfirmWidget(
                    'Spielstand zurücksetzen',
                    'Bist du sicher? Dies kann nicht rückgängig gemacht werden!',
                    'Abbruch', 'Zurücksetzen',
                ).show().then(choice => {
                    if (choice) {
                        this.app_state.reset()
                        location.reload()
                    }
                })
            })
        }

        await click_once(this.btn)
        this.hide()
    }

    hide() {
        this.animation?.pause()
        this.el.remove()
        remove_widget(this)
    }
}
