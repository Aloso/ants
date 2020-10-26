// Polyfills for promises, generators and async-await:
import 'core-js/features/promise'
import 'regenerator-runtime/runtime'

// Stylesheets
import './styles/index.sass'

// Import modules dynamically:
// import(/* webpackChunkName: "foo" */ './foo').then((foo) => ...)

import { setupGlobalState } from './logic/app_state'
import { setupInterface } from './interface/setup'
import { History } from './util/history'
import { MainScreen } from './interface/main'
import { h, render } from 'preact'

async function main() {
  await History.setup()
  await setupInterface()
  const appState = await setupGlobalState()
  render(<MainScreen appState={appState} />, document.body)
}

main().catch(console.error)
