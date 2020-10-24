// Polyfills for promises, generators and async-await:
import 'core-js/features/promise'
import 'regenerator-runtime/runtime'

// Stylesheets
import './index.sass'

// Import modules dynamically:
// import(/* webpackChunkName: "foo" */ './foo').then((foo) => ...)

import { StartWidget } from './interface/start_widget'
import { show_intro_widgets } from './interface/intro'
import { setup_global_state } from './logic/app_state'

// enable hot reloading for this module:
// if (module.hot) {
//     module.hot.accept()
//     module.hot.addDisposeHandler(() => remove_all_widgets())
// }

if (window.innerHeight < window.innerWidth) {
    alert('Dieses Spiel sollte auf einem Handy im Hochformat geöffnet werden.')
}

async function main() {
    const app_state = await setup_global_state()
    await new StartWidget(app_state).show()
    await show_intro_widgets(app_state)
}

main().catch(console.error)
