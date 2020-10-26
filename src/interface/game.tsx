import { h, Fragment, RenderableProps } from 'preact'
import { useEffect } from 'preact/hooks'

export function Game(_props: RenderableProps<{}>) {
  useEffect(() => {
    document.title = 'Game'
  })
  return <>
    <h1>Game</h1>
    <p>It works!</p>
  </>
}
