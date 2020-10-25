import { err } from '../util'
import { StartAnimationCanvas } from './start_animation'
import { Component, createRef, h, RenderableProps } from 'preact'
import { AppState } from 'logic/app_state'
import { useCallback } from 'preact/hooks'

export interface StartScreenProps {
  app_state: AppState
  onProceed(): void
  onReset(): void
}

export class StartScreen extends Component<StartScreenProps> {
  private readonly btn = createRef<HTMLButtonElement>()
  private readonly resetBtn = createRef<HTMLButtonElement>()

  state = {
    buttons_visible: false,
    has_started: false,
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
      <div class="start-screen">
        <StartAnimationCanvas />
        <div class="centered">
          <h1>Ameisen</h1>
          <div>Ein Weihnachtsspiel</div>
          <button class="start-btn" style="opacity: 0" ref={this.btn} onClick={start}>Start</button>
          <br /><br />
          <button class="reset-btn" style="opacity: 0" ref={this.resetBtn} onClick={reset}>Spielstand zurücksetzen</button>
        </div>
      </div>
    )
  }
}
