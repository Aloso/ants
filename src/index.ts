// Polyfills for promises, generators and async-await:
import 'core-js/features/promise'
import 'regenerator-runtime/runtime'

// Stylesheets
import './index.sass'

// Import modules dynamically:
// import(/* webpackChunkName: "foo" */ './foo').then((foo) => ...)

import { start_screen } from './start_screen'

// enable hot reloading for this module:
if (module.hot) module.hot.accept()

function start() {
    start_screen().then(start)
}
start()
