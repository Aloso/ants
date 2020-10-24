import { Animation, animate, err } from '../util'
import { Component, createRef, h, RenderableProps } from 'preact'
import { AppState } from 'logic/app_state'
import { useCallback } from 'preact/hooks'

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

class StartAnimationCanvas extends Component {
  private canvas = createRef<HTMLCanvasElement>()
  private animation?: Animation

  componentDidMount() {
    const canvas = this.canvas.current ?? err('Canvas is not defined')
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
  }

  componentWillUnmount() {
    this.animation?.pause()
  }

  render = () =>
    <canvas class="start-canvas" ref={this.canvas}></canvas>
}

export interface StartScreenProps {
  app_state: AppState
  onProceed(): void
  onReset(): void
}

export class StartScreen extends Component<StartScreenProps> {
  private btn = createRef<HTMLButtonElement>()
  private resetBtn = createRef<HTMLButtonElement>()

  state = {
    buttons_visible: false,
    has_started: false
  }

  componentDidMount() {
    this.state.has_started = this.props.app_state.name != null

    setTimeout(() => {
      if (this.btn.current == null || this.resetBtn.current == null) err('Button is null')
      this.btn.current.style.opacity = '1'
      if (this.state.has_started) {
        this.resetBtn.current.style.opacity = '1'
      }
      setTimeout(() => this.state.buttons_visible = true, 300)
    }, 300)
  }

  componentWillUnmount() {
    this.state.buttons_visible = false
    this.state.has_started = false
  }

  render(props: RenderableProps<StartScreenProps>) {
    const start = useCallback(() => {
      if (this.state.buttons_visible) props.onProceed()
    }, [])

    const reset = useCallback(async () => {
      if (this.state.has_started && this.state.buttons_visible) props.onReset()
    }, [])

    return (
      <div class="widget start-widget">
        <StartAnimationCanvas />
        <div class="centered">
          <h1>Ameisen</h1>
          <div>Ein Weihnachtsspiel</div>
          <button class='start-btn' style="opacity: 0" ref={this.btn} onClick={start}>Start</button>
          <br /><br />
          <button class='reset-btn' style="opacity: 0" ref={this.resetBtn} onClick={reset}>Spielstand zurücksetzen</button>
        </div>
      </div>
    )
  }
}
