import { h, Fragment, RenderableProps } from 'preact'
import { useEffect } from 'preact/hooks'

export function Tip(props: RenderableProps<{ onProceed(): void }>) {
  useEffect(() => {
    document.title = 'Tip'
  })
  return <>
    <p>Tip</p>
    <button onClick={props.onProceed}>Super!</button>
  </>
}
