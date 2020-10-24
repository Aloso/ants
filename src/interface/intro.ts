import { b, em, node, nodes, p, ul } from './node_util'
import { Widget } from './widgets'
import { IntroWidget } from './intro_widget'
import { AppState } from '../logic/app_state'

function email_link(text: string, href: string): HTMLAnchorElement {
    return node('a', text, { attrs: { href } })
}

function widget_1(_: AppState): Widget {
    return new IntroWidget('Hallo', nodes(
        p(`Ich bin `, b(`Formi`), `, dein ständiger Begleiter in diesem Spiel. Ich werde dir bei Problemen zur Seite stehen und dich immer wieder anfeuern 😉`),
        p(`Schön, dass du da bist! Wie du wahrscheinlich bereits festgestellt hast, ist dieses Spiel eine Web-App und keine native App für Android. Der Grund ist einfach, dass mein Schöpfer zu faul war, das Spiel im Play Store zu veröffentlichen 🙄`),
        p(`Damit die Bedienung trotzdem problemlos funktio­niert, hier ein paar Tipps:`),
        ul({ clss: 'highlight' },
            `Öffne die Website am besten in Chrome oder Ecosia für Android 🌲`,
            `Danach kannst du dieses Spiel zum Startbildschirm hinzufügen. Es verhält sich dann wie deine anderen Apps, nur dass du zum Öffnen der App eine Internetverbindung brauchst 🔌`,
            `Solange du den gleichen Browser verwendest, wird dein Spielstand automatisch gespeichert 💾`
        ),
        p(`Alles klar? Wenn etwas nicht funktioniert, ist das kein Problem. Unser Kundensupport beantwortet Fragen gerne per `, email_link('E-Mail', 'mailto:ludwig.stecher@gmx.de'), ` 📧.`),
    ))
}

function widget_2(app_state: AppState): Widget {
    const name_input = node('input', null, {
        clss: 'centered cursive big border-box w100',
        attrs: { type: 'text', placeholder: 'Name eingeben', value: app_state.name },
        on: {
            '+input+change'() {
                app_state.name = name_input.value
                widget.can_proceed = app_state.name != null
            },
            keypress(e: KeyboardEvent) {
                if (e.key === 'Enter' && widget.can_proceed) {
                    widget.proceed.resolve()
                }
            },
        },
    })

    const widget = new IntroWidget(null, nodes(
        node('p', nodes(`Ich bin `, b(`Formi`), `.. Moment, das hatten wir schon. Wie darf ich dich nennen?`),
            { clss: 'no-margin-top' }),
        name_input
    ), app_state.name != null)
    return widget
}

function widget_3(app_state: AppState): Widget {
    return new IntroWidget(`Alles klar, ${app_state.name}!`, nodes(
        p(`In diesem Spiel wollen wir einen Ameisenstaat grün­den. Aber nicht bloß irgendeinen Staat: Den größten, den du dir vorstellen kannst! Damit uns das gelingt, müssen wir uns erst einmal mit den Spielregeln beschäftigen 🐜.`),
        p(`Unsere Art, `, b(`Formicida curiosa`), `, lebt in den Wäldern Südamerikas. Hier haben wir die idealen Bedingungen, um uns zu vermehren. Als Allesfresser haben wir auch jede Menge Nahrung. Leider haben wir auch viel Kon­kur­renz: Tausende Ameisenarten sind hier heimisch.`),
        p(`Du wirst schnell feststellen, dass Ameisen nicht immer friedlich sind: Manche Staaten werden uns angreifen und versuchen, unsere Eier zu stehlen. Denn die sind nicht nur wichtig zur Fort­pflan­zung, sondern auch ziemlich lecker 😋.`),
        p(`Wenn wir genug Kämp­fer­innen haben, können wir auch andere Staaten angreifen. Aber Vorsicht: Wir sind eine vergleichsweise `, node('small', 'kleine'), ` Art. Größere Ameisen können wir nur besiegen, wenn wir `, em(`zahlenmäßig`), ` deutlich überlegen sind.`)
    ))
}

function widget_4(_: AppState): Widget {
    return new IntroWidget(`Spielregeln`, nodes(
        p(`Ameisen sind exzellente Teamarbeiter! Wir kommunizieren über Duftstoffe (Pheromone).`),
        p(`Damit können wir uns mitteilen, wo sich Nahrung oder Baumaterial für den Ameisenbau befindet, oder welche Gebiete besser gemieden werden sollten. Das können feindliche Ameisenstaaten sein, aber auch Fressfeinde wie z.B. Ameisenbären.`)
    ))
}

const intro_widgets: ((app_state: AppState) => Widget)[] = [
    widget_1,
    widget_2,
    widget_3,
    widget_4,
]

export async function show_intro_widgets(state: AppState) {
    while (state.intro_id < 4) {
        await intro_widgets[state.intro_id](state).show()
        state.intro_id += 1
    }
}
