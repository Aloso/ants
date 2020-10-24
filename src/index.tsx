// Polyfills for promises, generators and async-await:
import 'core-js/features/promise'
import 'regenerator-runtime/runtime'

// Stylesheets
import './index.sass'

// Import modules dynamically:
// import(/* webpackChunkName: "foo" */ './foo').then((foo) => ...)

import { setup_global_state } from './logic/app_state'
import { setup_interface } from './interface/setup'
import { MainScreen } from './interface/main'
import { h, render } from 'preact'

async function main() {
  await setup_interface()
  const app_state = await setup_global_state()
  render(<MainScreen app_state={app_state} />, document.body)
}

main().catch(console.error)
