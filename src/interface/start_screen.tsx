import { err } from '../util'
import { StartAnimationCanvas } from './start_animation'
import { Component, createRef, h, RenderableProps } from 'preact'
import { AppState } from 'logic/app_state'
import { useCallback } from 'preact/hooks'

export interface StartScreenProps {
  appState: AppState
  onProceed(): void
  onReset(): void
}

interface StartScreenState {
  buttonsVisible: boolean
  introShown: boolean
}

export class StartScreen extends Component<StartScreenProps, StartScreenState> {
  private readonly btn = createRef<HTMLButtonElement>()
  private readonly resetBtn = createRef<HTMLButtonElement>()

  state = {
    buttonsVisible: false,
    introShown: false,
  }

  componentDidMount() {
    this.state.introShown = this.props.appState.introShown

    setTimeout(() => {
      if (this.btn.current == null || this.resetBtn.current == null) err('Button is null')
      this.btn.current.style.opacity = '1'
      if (this.state.introShown) {
        this.resetBtn.current.style.opacity = '1'
      }
      setTimeout(() => this.state.buttonsVisible = true, 300)
    }, 300)
  }

  componentWillUnmount() {
    this.state.buttonsVisible = false
    this.state.introShown = false
  }

  render(props: RenderableProps<StartScreenProps>) {
    const start = useCallback(() => {
      if (this.state.buttonsVisible) props.onProceed()
    }, [])

    const reset = useCallback(async () => {
      if (this.state.introShown && this.state.buttonsVisible) props.onReset()
    }, [])

    return (
      <div class="start-screen">
        <StartAnimationCanvas />
        <div class="centered">
          <h1>Ameisen</h1>
          <div>Ein Weihnachtsspiel</div>
          <button class="start-btn" style="opacity: 0" ref={this.btn} onClick={start}>Start</button>
          <br /><br />
          <button class="reset-btn" style="opacity: 0" ref={this.resetBtn} onClick={reset}>Zurücksetzen</button>
        </div>
      </div>
    )
  }
}
