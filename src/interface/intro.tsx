import { JSX, h, Fragment, RenderableProps } from 'preact'
import { useCallback, useState } from 'preact/hooks'
import { AppState } from '../logic/app_state'

type IntroProps = RenderableProps<{ title?: string, onProceed: () => void, can_proceed?: boolean }>
type WidgetProps = RenderableProps<{ app_state: AppState, onProceed: () => void }>
type ScreenFunction = (props: WidgetProps) => JSX.Element

export const IntroScreen = (props: IntroProps): JSX.Element =>
  <div class="widget intro-widget">
    <div class="intro-widget-inner">
      {props.title == null ? null : <h1>{props.title}</h1>}
      {props.children}
      <div class="align-right margin-top">
        <button class="big" disabled={!(props.can_proceed ?? true)} onClick={props.onProceed}>Weiter</button>
      </div>
    </div>
  </div>

const Screen1: ScreenFunction = (props: WidgetProps) =>
  <IntroScreen title="Hallo" onProceed={props.onProceed}>
    <p>Ich bin <b>Formi</b>, dein ständiger Begleiter in diesem Spiel.
      Ich werde dir bei Problemen zur Seite stehen und dich immer wieder anfeuern 😉</p>
    <p>Schön, dass du da bist! Wie du wahrscheinlich bereits festgestellt hast,
    ist dieses Spiel eine Web-App und keine native App für Android. Der Grund ist einfach,
      dass mein Schöpfer zu faul war, das Spiel im Play Store zu veröffentlichen 🙄</p>
    <p>Damit die Bedienung trotzdem problemlos funktio­niert, hier ein paar Tipps:</p>

    <ul class="highlight">
      <li>Öffne die Website am besten in Chrome oder Ecosia für Android 🌲</li>
      <li>Danach kannst du dieses Spiel zum Startbildschirm hinzufügen.
      Es verhält sich dann wie deine anderen Apps, nur dass du zum Öffnen der App
        eine Internetverbindung brauchst 🔌</li>
      <li>Solange du den gleichen Browser verwendest, wird dein Spielstand automatisch gespeichert 💾</li>
    </ul>

    <p>Alles klar? Wenn etwas nicht funktioniert, ist das kein Problem. Unser Kundensupport beantwortet Fragen gerne per <a href="mailto:ludwig.stecher@gmx.de">E-Mail</a> 📧.</p>
  </IntroScreen>

const Screen2: ScreenFunction = (props: WidgetProps) => {
  const [canProceed, setProceedable] = useState(props.app_state.name != null)
  const [name, setName] = useState(props.app_state.name ?? '')

  const change = useCallback((event: any) => {
    props.app_state.name = event.target.value as string
    setName(props.app_state.name)
    setProceedable(props.app_state.name != null)
  }, [canProceed, name])

  const keyPress = useCallback((event: any) => {
    if (event.key === 'Enter' && canProceed) props.onProceed()
  }, [canProceed])

  return (
    <IntroScreen title="Hallo" onProceed={props.onProceed} can_proceed={canProceed}>
      <p class="no-margin-top">Ich bin <b>Formi</b>.. Moment, das hatten wir schon. Wie darf ich dich nennen?</p>

      <input type="text" placeholder="Name eingeben" value={name}
        onInput={change} onChange={change} onKeyPress={keyPress}
        class="centered cursive big border-box w100" />
    </IntroScreen>
  )
}

const Screen3: ScreenFunction = (props: WidgetProps) =>
  <IntroScreen title={`Alles klar, ${props.app_state.name}!`} onProceed={props.onProceed}>
    <p>In diesem Spiel wollen wir einen Ameisenstaat grün­den. Aber nicht bloß irgendeinen Staat:
    Den größten, den du dir vorstellen kannst! Damit uns das gelingt, müssen wir uns erst einmal
      mit den Spielregeln beschäftigen 🐜.</p>
    <p>Unsere Art, <b>Formicida curiosa</b>, lebt in den Wäldern Südamerikas.
      Hier haben wir die idealen Bedingungen, um uns zu vermehren.
      Als Allesfresser haben wir auch jede Menge Nahrung. Leider haben wir auch viel Kon­kur­renz:
      Tausende Ameisenarten sind hier heimisch.</p>
    <p>Du wirst schnell feststellen, dass Ameisen nicht immer friedlich sind:
    Manche Staaten werden uns angreifen und versuchen, unsere Eier zu stehlen.
      Denn die sind nicht nur wichtig zur Fort­pflan­zung, sondern auch ziemlich lecker 😋.</p>
    <p>Wenn wir genug Kämp­fer­innen haben, können wir auch andere Staaten angreifen.
      Aber Vorsicht: Wir sind eine vergleichsweise <small>kleine</small> Art.
      Größere Ameisen können wir nur besiegen, wenn wir <em>zahlenmäßig</em> deutlich überlegen sind.</p>
  </IntroScreen>

const Screen4: ScreenFunction = (props: WidgetProps) =>
  <IntroScreen title="Spielregeln" onProceed={props.onProceed}>
    <p>Ameisen sind exzellente Teamarbeiter! Wir kommunizieren über Duftstoffe (Pheromone).</p>
    <p>Damit können wir uns mitteilen, wo sich Nahrung oder Baumaterial für den Ameisenbau befindet,
    oder welche Gebiete besser gemieden werden sollten. Das können feindliche Ameisenstaaten sein,
      aber auch Fressfeinde wie z.B. Ameisenbären.</p>
  </IntroScreen>


const introScreens: ScreenFunction[] = [Screen1, Screen2, Screen3, Screen4]

export function Intro(props: WidgetProps): JSX.Element {
  const [index, setIndex] = useState(props.app_state.intro_id)

  if (index >= introScreens.length) {
    props.onProceed()
    return <></>
  } else {
    const onProceed = useCallback(() => {
      const idx = Math.min(index + 1, introScreens.length)
      setIndex(idx)
      props.app_state.intro_id = idx
    }, [index])

    return introScreens[index]({ ...props, onProceed })
  }
}
