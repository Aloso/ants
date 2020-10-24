import { err } from '../util'

export function byId<T extends HTMLElement = HTMLElement>(id: string, ty?: new () => T): T {
    const el = document.getElementById(id) ?? err(`Element #${id} doesn't exist`)
    if (ty == null || el.constructor === ty) return el as T
    else err(`Element #${id} is not a ${ty.name}`)
}

export function click_once(elem: HTMLElement): Promise<MouseEvent> {
    return new Promise((resolve) => {
        const click = (e: MouseEvent) => {
            elem.removeEventListener('click', click)
            resolve(e)
        }
        elem.addEventListener('click', click)
    })
}

type EventListener<E extends Event> = (event: E) => void

export interface NodeOptions {
    id?: string
    clss?: string
    attrs?: { [key: string]: string | null }
    on?: { [ev_name: string]: EventListener<any> }
}

/**
 * Create an HTML element. Example:
 *
 * ```
 * node('button', 'Click me!', {
 *   id: 'my-button',
 *   clss: 'red',
 *   attrs: { title: `Don't worry, it's safe` },
 *   on: {
 *     click() {},
 *     '+mousedown+mouseup'() {}, // note the leading '+'
 *   },
 * })
 * ```
 *
 * To add multiple children, use the `nodes()` function.
 *
 * @param ty The name of the HTML element
 * @param content The content, as string or Node
 * @param options Things to add to the node
 */
export function node<K extends keyof HTMLElementTagNameMap>(
    ty: K,
    content?: string | Node | null,
    options?: NodeOptions,
): HTMLElementTagNameMap[K] {
    const el = document.createElement(ty)
    if (content != null) el.append(content)
    if (options != null) applyOptions(el, options)
    return el
}

function applyOptions(el: HTMLElement, options: NodeOptions) {
    if (options.id != null) el.id = options.id
    if (options.clss != null) el.className = options.clss
    if (options.attrs != null) {
        for (const key in options.attrs) {
            const value = options.attrs[key]
            if (value != null) el.setAttribute(key, value)
        }
    }
    if (options.on != null) {
        for (const ev_name in options.on) {
            const event_handler = options.on[ev_name]
            if (ev_name.startsWith('+')) {
                const ev_names = ev_name.split('+')
                ev_names.shift()
                ev_names.forEach(n => el.addEventListener(n, event_handler))
            } else {
                el.addEventListener(ev_name, event_handler)
            }
        }
    }
}

export function b(content: string | Node): HTMLElement {
    const el = document.createElement('b')
    el.append(content)
    return el
}

export function em(content: string | Node): HTMLElement {
    const el = document.createElement('i')
    el.append(content)
    return el
}

export function br(): HTMLBRElement {
    return document.createElement('br')
}

export function p(...items: (string | Node)[]): HTMLParagraphElement {
    const el = document.createElement('p')
    for (const item of items) {
        el.append(item)
    }
    return el
}

export function ul(options?: NodeOptions, ...items: (string | Node)[]): HTMLUListElement {
    const el = document.createElement('ul')
    for (const item of items) {
        el.append(node('li', item))
    }
    if (options != null) applyOptions(el, options)
    return el
}

/**
 * Create a document fragment to add multiple nodes to a parent node at once.
 *
 * @param items The nodes
 */
export function nodes(...items: (string | Node | null | undefined)[]): DocumentFragment {
    const frag = document.createDocumentFragment()
    for (const item of items) {
        if (item != null) frag.append(item)
    }
    return frag
}
