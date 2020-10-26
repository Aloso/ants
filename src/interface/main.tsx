import { AppState } from 'logic/app_state'

import { StartScreen } from './start_screen'
import { Intro } from './intro'
import { Tip } from './tip'
import { Game } from './game'
import { Modal, ModalArgs } from './modals'
import { History } from '../util/history'
import { RenderableProps, h, Fragment, JSX, Component } from 'preact'

type MainScreenPhase =
  | 'home'
  | 'intro'
  | 'tip'
  | 'game'

interface MainScreenProps {
  appState: AppState
}

interface MainScreenState {
  phase: MainScreenPhase
  modals: ModalArgs[]
}

export class MainScreen extends Component<MainScreenProps, MainScreenState> {
  state = {
    phase: 'home' as MainScreenPhase,
    modals: [] as ModalArgs[],
  }

  proceed(appState: AppState) {
    const tipAvailable = true

    const oldPhase = this.state.phase
    let newPhase: MainScreenPhase
    switch (oldPhase) {
      case 'home':
        if (appState.introShown) newPhase = tipAvailable ? 'tip' : 'game'
        else newPhase = 'intro'
        break
      case 'intro':
        appState.introShown = true
        newPhase = tipAvailable ? 'tip' : 'game'
        break
      case 'tip':
        newPhase = 'game'
        break
      case 'game':
        newPhase = 'game'
        break
    }
    History.push(() => {
      this.setState({ phase: oldPhase })
      if (oldPhase !== 'home') {
        history.back()
      }
    }, oldPhase === 'home')
    this.setState({ phase: newPhase })
  }

  reset(appState: AppState) {
    const modal: ModalArgs = {
      title: 'Spielstand zurücksetzen',
      message: 'Bist du sicher? Dies kann nicht rückgängig gemacht werden!',
      confirm: 'Zurücksetzen',
      cancel: 'Abbruch',
      onClose(confirmed: boolean) {
        if (confirmed) {
          appState.reset()
          window.history.back()
          setTimeout(() => location.reload(), 10)
        } else {
          window.history.back()
        }
      },
    }
    History.push(() => {
      this.setState({ modals: this.state.modals.filter(m => m !== modal) })
    }, true)
    this.setState({ modals: [...this.state.modals, modal] })

    document.title = 'Ameisen – Spielstand zurücksetzen'
  }

  render({ appState: appState }: RenderableProps<MainScreenProps>, { phase, modals }: MainScreenState) {
    const proceed = () => this.proceed(appState)

    let screen: JSX.Element
    switch (this.state.phase) {
      case 'home':
        screen = <StartScreen appState={appState} onProceed={proceed} onReset={() => this.reset(appState)} />
        break
      case 'intro':
        screen = <Intro appState={appState} onProceed={proceed} />
        break
      case 'tip':
        screen = <Tip onProceed={proceed} />
        break
      case 'game':
        screen = <Game />
        break
    }

    return <>{screen}{modals.map((args: ModalArgs) => <Modal {...args} />)}</>
  }
}
