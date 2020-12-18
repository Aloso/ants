import { h, JSX, RenderableProps, Component } from 'preact'
import { useEffect, useState } from 'preact/hooks'

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

export function Modal(props: ModalProps): JSX.Element {
  const [phase, setPhase] = useState<ModalState>('fading-in')

  useEffect(() => {
    setTimeout(() => {
      if (phase === 'fading-in') setPhase('paused')
    }, 300)
  })

  const click = (result: boolean) => {
    if (phase === 'paused') {
      setPhase('fading-out')
      setTimeout(() => props.onClose(result), 300)
    }
  }

  return <div class={`modal ${phase}`}>
    <div class="modal-inner">
      <h1>{props.title}</h1>
      {props.message != null ? <p>{props.message}</p> : null}
      <div class="align-right margin-top">
        <button class="big cancel" onClick={() => click(false)}>{props.cancel ?? 'Abbrechen'}</button>
        <button class="big confirm" onClick={() => click(true)}>{props.confirm ?? 'Bestätigen'}</button>
      </div>
    </div>
  </div>
}
