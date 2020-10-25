import { AppState } from 'logic/app_state'

import { StartScreen } from './start_screen'
import { Intro } from './intro'
import { Modal, ModalArgs } from './modals'
import { useArrayState } from '../util'
import { RenderableProps, h, Fragment } from 'preact'
import { useState } from 'preact/hooks'

export function MainScreen(props: RenderableProps<{ app_state: AppState }>) {
  const [started, setStarted] = useState(false)
  const [modals, addModal, removeModal] = useArrayState([] as ModalArgs[])

  function reset() {
    const modal = addModal({
      title: 'Spielstand zurücksetzen',
      message: 'Bist du sicher? Dies kann nicht rückgängig gemacht werden!',
      confirm: 'Zurücksetzen',
      cancel: 'Abbruch',
      onClose(confirmed) {
        if (confirmed) {
          props.app_state.reset()
          location.reload()
        }
        removeModal(modal)
      },
    })
  }

  const screen = started
    ? <Intro app_state={props.app_state} onProceed={() => void 0} />
    : <StartScreen app_state={props.app_state} onProceed={() => setStarted(true)} onReset={reset} />

  return <>
    {screen}
    {modals.map(({ title, message, cancel, confirm, onClose }: ModalArgs) =>
      <Modal title={title} message={message} cancel={cancel} confirm={confirm} onClose={onClose} />)}
  </>
}
