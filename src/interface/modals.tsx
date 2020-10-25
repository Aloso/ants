import { h, JSX, RenderableProps, Component } from 'preact'

export interface ModalArgs {
  title: string
  message?: string
  cancel?: string
  confirm?: string

  onClose(confirmed: boolean): void
}

type ModalProps = RenderableProps<ModalArgs>

type ModalState =
  | 'fading-in'
  | 'paused'
  | 'fading-out'

export class Modal extends Component<ModalArgs, { phase: ModalState }> {
  state = {
    phase: 'fading-in' as ModalState,
  }

  componentDidMount() {
    setTimeout(() => {
      if (this.state.phase === 'fading-in') this.setState({ phase: 'paused' })
    }, 300)
  }

  click(result: boolean) {
    if (this.state.phase === 'paused') {
      this.setState({ phase: 'fading-out' })
      setTimeout(() => this.props.onClose(result), 300)
    }
  }

  render({ title, message, confirm, cancel }: ModalProps): JSX.Element {
    return (
      <div class={`modal ${this.state.phase}`}>
        <div class="modal-inner">
          <h1>{title}</h1>
          {message != null ? <p>{message}</p> : null}
          <div class="align-right margin-top">
            <button class="big cancel" onClick={() => this.click(false)}>{cancel ?? 'Abbrechen'}</button>
            <button class="big confirm" onClick={() => this.click(true)}>{confirm ?? 'Bestätigen'}</button>
          </div>
        </div>
      </div>
    )
  }
}
