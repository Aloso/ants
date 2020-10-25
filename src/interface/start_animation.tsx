import { animate, Animation, err } from '../util'
import { h, Component, createRef } from 'preact'

export class StartAnimationCanvas extends Component {
  private readonly canvas = createRef<HTMLCanvasElement>()
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
    const startPaths: Path[] = []
    let remaining = size.width * size.height / 20

    this.animation = animate(() => {
      if (paths.length < 7 && remaining > 0) {
        paths.push(startPaths.shift() ?? new Path(canvas.width, canvas.height))
      }
      paths = paths.filter(path => {
        remaining -= 1
        const s = path.split_off()
        if (s != null) {
          startPaths.push(s)
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
    <canvas class="start-canvas" ref={this.canvas} > </canvas>
}


export class Path {
  private length = 0
  private lenSinceSplit = 50

  constructor(
    private readonly width: number,
    private readonly height: number,
    private px = Math.random() * width,
    private py = 0,
    private direction = 0,
  ) {
  }

  split_off(): Path | null {
    if (this.lenSinceSplit > 70 && Math.random() < 0.008) {
      const addDir = Math.random() < 0.5 ? 10 : -10
      const path = new Path(this.width, this.height, this.px, this.py, this.direction + addDir)
      path.lenSinceSplit = this.lenSinceSplit = 0
      return path
    } else {
      return null
    }
  }

  next(ctx: CanvasRenderingContext2D) {
    this.direction += Math.random() * 2 - 1
    this.length += 1
    this.lenSinceSplit += 1

    ctx.moveTo(this.px, this.py)
    this.px += Math.sin(this.direction / 12) * devicePixelRatio * 1.2
    this.py += Math.cos(this.direction / 12) * devicePixelRatio * 1.2
    ctx.lineTo(this.px, this.py)

    const inScreen = this.px >= 0 && this.px <= this.width && this.py >= 0 && this.py <= this.height
    return inScreen && (this.length < 100 || Math.random() > 0.005)
  }
}
