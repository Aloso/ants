import { AppState } from '../logic/app_state'
import { h, Fragment, RenderableProps } from 'preact'
import { useEffect } from 'preact/hooks'

type TipProps = RenderableProps<{ appState: AppState, onProceed(): void }>

const tipsAvailable = false

export function Tip(props: TipProps) {
  if (!tipsAvailable) {
    props.onProceed()
    return <></>
  }
  useEffect(() => {
    document.title = 'Tip'
  })

  const tips = [
    <><b>This</b> is nice tip!</>,
    <>Another tip!</>,
  ]

  return <div class="tip-screen">
    <div class="tip-screen-inner">
      <h1>Tip</h1>
      {tips[0]}
      <div class="align-right margin-top">
        <button class="big" onClick={props.onProceed}>Super!</button>
      </div>
    </div>
  </div>
}
