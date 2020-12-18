import { AppState } from '../logic/app_state'
import { Ant, AnyKind } from '../logic/game'
import { Anthill } from './anthill'
import { h, JSX, Fragment, RenderableProps } from 'preact'
import { useEffect, useState } from 'preact/hooks'

interface GameState {
  ants: {
    queens: Ant<'queen'>[],
    drones: Ant<'drone'>[],
    workers: Ant<'worker'>[],
    soldiers: Ant<'soldier'>[],
  }
}

function TopBar(_props: RenderableProps<{}>) {
  return <div id="top-bar">
    Fancy!
  </div>
}

type View = 'anthill' | 'outside'

export type ViewProps = RenderableProps<{ appState: AppState, gameState: GameState }>

const views: { [V in View]: (props: ViewProps) => JSX.Element } = {
  anthill: Anthill,
  outside: Outside,
}

function GameInner(props: ViewProps & { viewIdx: View }) {
  return views[props.viewIdx](props)
}

export function Outside(_props: ViewProps) {
  return <>Outside</>
}

export function Game(props: RenderableProps<{ appState: AppState }>) {
  useEffect(() => {
    document.title = 'Game'
  })

  const [view, setView] = useState<View>('anthill')
  const [gameState, setGameState] = useState<GameState>({
    ants: {
      queens: [new Ant('queen', 100, 30, 20, 5, +new Date(), 100, 100, 100, 100, 100, 'relaxing',
        getQueenName())],
      drones: [],
      soldiers: [],
      workers: [],
    },
  })

  return <div id="game">
    <TopBar />
    <GameInner appState={props.appState} gameState={gameState} viewIdx={view} />
  </div>
}

const queenNames = [
  'Nitokris',
  'Hatschepsut',
  'Atalja',
  'Iskallatu',
  'Berenike',
  'Kleopatra IV.',
  'Zenobia',
  'Irene',
  'Eleonore',
  'Mathilde',
  'Konstanze',
  'Margarete',
  'Johanna I.',
  'Maria',
  'Hedwig',
  'Anna',
  'Okiko',
  'Christina',
  'Katharina I.',
  'Toshiko',
  'Ranavalona I.',
  'Victoria',
  'Liluokalani',
  'Juliana',
  'Charlotte',
  'Beatrix',
]

function getQueenName(): string {
  // tslint:disable-next-line: no-bitwise
  return queenNames[(Math.random() * queenNames.length) | 0]
}
