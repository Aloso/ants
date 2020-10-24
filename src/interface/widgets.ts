
const active_widgets: Widget<any>[] = []

export function add_widget(w: Widget<any>) {
    active_widgets.push(w)
}
export function remove_widget(t: Widget<any>) {
    const idx = active_widgets.findIndex(w => w === t)
    if (idx !== -1) active_widgets.splice(idx, 1)
}
export function remove_all_widgets() {
    const aw = active_widgets
    active_widgets.length = 0
    aw.forEach(w => w.hide())
}

export interface Widget<T = void> {
    show(): Promise<T>
    hide(): void
}
