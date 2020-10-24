import { resolvable_promise } from '../util'
import { click_once, node, nodes } from './node_util'
import { add_widget, remove_widget, Widget } from './widgets'

export class IntroWidget implements Widget {
    private readonly el: HTMLElement
    private readonly next_btn: HTMLButtonElement

    readonly proceed = resolvable_promise()

    constructor(
        private readonly title: string | Node | null,
        private readonly msg: string | Node,
        private can_proceed_ = true,
    ) {
        this.next_btn = node('button', 'Weiter', { clss: 'big' })
        if (!can_proceed_) this.next_btn.disabled = true

        const inner = node('div', nodes(
            title != null ? node('h1', title) : null,
            msg,
            node('div', this.next_btn, { clss: 'align-right margin-top' }),
        ), { clss: 'intro-widget-inner' })

        this.el = node('div', inner, { clss: 'widget intro-widget' })
    }

    get can_proceed(): boolean {
        return this.can_proceed_
    }
    set can_proceed(value: boolean) {
        this.can_proceed_ = value
        this.next_btn.disabled = !value
        add_widget(this)
    }

    async show() {
        add_widget(this)
        document.body.append(this.el)
        await Promise.race([
            click_once(this.next_btn),
            this.proceed,
        ])
        this.hide()
    }

    hide() {
        this.el.remove()
        remove_widget(this)
    }
}
