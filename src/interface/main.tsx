import { AppState } from 'logic/app_state'

import { StartScreen } from './start_screen'
import { Intro } from './intro'
import { ConfirmWidget } from './confirm_widget'
import { RenderableProps, h } from 'preact'
import { useCallback, useState } from 'preact/hooks'

export function MainScreen(props: RenderableProps<{ app_state: AppState }>) {
  const [started, setStarted] = useState(false)
  const start = useCallback(() => {
    setStarted(true)
  }, [started])

  const reset = useCallback(async () => {
    const choice = await new ConfirmWidget(
      'Spielstand zurücksetzen',
      'Bist du sicher? Dies kann nicht rückgängig gemacht werden!',
      'Abbruch', 'Zurücksetzen',
    ).show()
    if (choice) {
      props.app_state.reset()
      location.reload()
    }
  }, [])

  if (!started) return <StartScreen app_state={props.app_state} onProceed={start} onReset={reset} />
  else return <Intro app_state={props.app_state} onProceed={() => { }
  } />
}
