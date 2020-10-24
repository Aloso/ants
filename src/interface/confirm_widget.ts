import { click_once, node, nodes, p } from './node_util'
import { add_widget, remove_widget, Widget } from './widgets'

export class ConfirmWidget implements Widget<boolean> {
    private readonly el: HTMLElement
    private readonly yes_btn: HTMLButtonElement
    private readonly no_btn: HTMLButtonElement

    constructor(
        private title: string,
        private message?: string | null,
        private cancel = 'Abbrechen',
        private confirm = 'Bestätigen',
    ) {
        this.no_btn = node('button', cancel, { clss: 'big cancel' })
        this.yes_btn = node('button', confirm, { clss: 'big confirm' })

        const inner = node('div', nodes(
            node('h1', title),
            message != null ? p(message) : null,
            node('div', nodes(this.no_btn, this.yes_btn), { clss: 'align-right margin-top' })
        ), { clss: 'confirm-widget-inner' })

        this.el = node('div', inner, { clss: 'widget confirm-widget' })
    }

    async show(): Promise<boolean> {
        add_widget(this)
        document.body.append(this.el)

        const result = await Promise.race([
            click_once(this.no_btn).then(() => false),
            click_once(this.yes_btn).then(() => true),
        ])

        this.hide()
        return result
    }

    hide() {
        this.el.remove()
        remove_widget(this)
    }
}
