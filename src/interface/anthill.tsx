import { ViewProps } from './game'
import { Ant, printQueenOccupation, printWorkerOccupation } from '../logic/game'
import { err } from '../util'
import { h, Component, createRef, RenderableProps, Fragment, JSX } from 'preact'

export function Anthill(props: ViewProps) {
  const ants = props.gameState.ants
  const num = ants.queens.length + ants.drones.length + ants.soldiers.length + ants.workers.length

  return <div id="anthill">
    <AnthillCanvas size={Math.log(num + 1) / 8} />
    <div class="anthill-inner">
      <h1>Ameisenbau</h1>
      {num > 1 ? <p class="small dec-top">Beherbergt <b>{num} Ameisen</b></p> : ''}

      <QueenW data={ants.queens} />
      <WorkerW data={ants.workers} />
    </div>
  </div>
}

function QueenW({ data }: RenderableProps<{ data: Ant<'queen'>[] }>): JSX.Element {
  if (data.length > 4) {
    const map: { [desc: string]: number } = {}
    for (const ant of data) {
      const desc = printQueenOccupation(ant, false)
      if (desc in map) map[desc] += 1
      else map[desc] = 1
    }

    return <div class="ants queen">
      <h2>Königinnen</h2>
      {Object.keys(map).map(desc =>
        <div class="small">{desc}: <b>{map[desc]}</b></div>,
      )}
    </div>
  } else {
    return <>
      {data.map((ant: Ant<'queen'>) =>
        <div class="ant queen">
          <div class="flex-fill">
            <h3>Königin {ant.name ?? ''}</h3>
            <span class="small">{printQueenOccupation(ant, true)}</span>
          </div>
          <button class="select-occupation">Tätigkeit<br />wählen</button>
        </div>,
      )}
    </>
  }
}

function WorkerW({ data }: RenderableProps<{ data: Ant<'worker'>[] }>): JSX.Element {
  if (data.length > 4) {
    const map: { [desc: string]: number } = {}
    for (const ant of data) {
      const desc = printWorkerOccupation(ant)
      if (desc in map) map[desc] += 1
      else map[desc] = 1
    }

    return <div class="ants worker">
      <h2>Arbeiterinnen</h2>
      {Object.keys(map).map(desc =>
        <div class="small">{desc}: <b>{map[desc]}</b></div>,
      )}
    </div>
  } else {
    return <>
      {data.map((ant: Ant<'worker'>) =>
        <div class="ant worker">
          <div class="flex-fill">
            <h3>Königin {ant.name ?? ''}</h3>
            <span class="small">{printWorkerOccupation(ant)}</span>
          </div>
          <button class="select-occupation">Tätigkeit<br />wählen</button>
        </div>,
      )}
    </>
  }
}

class AnthillCanvas extends Component<{ size: number }> {
  private readonly canvas = createRef<HTMLCanvasElement>()

  componentDidMount() {
    this.componentDidUpdate()
  }

  componentDidUpdate() {
    const canvas: HTMLCanvasElement = this.canvas.current ?? err('Canvas is not defined')
    const size = canvas.getBoundingClientRect()
    canvas.width = Math.round(size.width * devicePixelRatio)
    canvas.height = Math.round(size.height * devicePixelRatio)

    const ctx: CanvasRenderingContext2D = canvas.getContext('2d') ?? err('Canvas not supported')
    ctx.fillStyle = '#712c1c'

    const width = canvas.width
    const height = canvas.height
    const hillSize = this.props.size
    const bottom = height - 20
    const absSize = bottom * hillSize
    const top = bottom - absSize
    const center = width / 2

    ctx.moveTo(-5, height + 5)
    ctx.lineTo(-5, bottom)
    ctx.lineTo(center - absSize, bottom)
    ctx.bezierCurveTo(center - absSize * 2 / 3, bottom, center - absSize / 2, top, center, top)
    ctx.bezierCurveTo(center + absSize / 2, top, center + absSize * 2 / 3, bottom, center + absSize, bottom)
    ctx.lineTo(width + 5, bottom)
    ctx.lineTo(width + 5, height + 5)

    ctx.strokeStyle = '#ffffff07'
    ctx.lineWidth = 6 * devicePixelRatio
    ctx.stroke()

    ctx.strokeStyle = '#ffffff22'
    ctx.lineWidth = 4 * devicePixelRatio
    ctx.stroke()

    ctx.strokeStyle = '#5b2519'
    ctx.lineWidth = 2 * devicePixelRatio
    ctx.fill()
    ctx.stroke()
  }

  render = () =>
    <canvas class="bg-canvas" ref={this.canvas} ></canvas>
}
