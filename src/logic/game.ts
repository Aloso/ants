import { err } from '../util'

export interface OccupationMap {
  queen: QueenOccupation
  drone: DroneOccupation
  worker: WorkerOccupation
  soldier: SoldierOccupation
}

export type AntKind = keyof OccupationMap
export type AnyKind = 'queen' | 'drone' | 'worker' | 'soldier'

export type Occupation = QueenOccupation | DroneOccupation | WorkerOccupation | SoldierOccupation

export type GenericOcc =
  | 'in egg'
  | 'growing up'
  | 'relaxing'
  | 'relocating'

export type QueenOccupation = GenericOcc | 'producing offspring'
export type DroneOccupation = GenericOcc | 'producing offspring'

export type WorkerOccupation = GenericOcc
  | 'caring for offspring'
  | 'gathering food'
  | 'gathering construction material'
  | 'milking lice'
  | 'enhancing ant hill'
  | 'sealing off ant hill'
  | 'unsealing ant hill'
  | 'cracking seeds'
  | 'fighting'

export type SoldierOccupation = GenericOcc
  | 'guarding'
  | 'spying'
  | 'fighting'

export class Ant<K extends AntKind> {
  constructor(
    public readonly kind: K,
    public sexualFitness: number,
    public size: number,
    public strength: number,
    public speed: number,

    public readonly birthday: number,
    public health: number,
    public restedness: number,

    public proteinLevel: number,
    public carbLevel: number,
    public fatLevel: number,

    public occupation: OccupationMap[K],

    public name?: string,
  ) { }

  public childType?: AntKind

  public isQueen(): this is Ant<'queen'> {
    return this.kind === 'queen'
  }

  public isDrone(): this is Ant<'drone'> {
    return this.kind === 'drone'
  }

  public isWorker(): this is Ant<'worker'> {
    return this.kind === 'worker'
  }

  public isSoldier(): this is Ant<'soldier'> {
    return this.kind === 'soldier'
  }
}

export class Game { }

export function printQueenOccupation(queen: Ant<'queen'>, specific: boolean): string {
  switch (queen.occupation) {
    case 'in egg': return 'Wird ausgebrütet'
    case 'growing up': return 'Im Wachstum'
    case 'relaxing': return 'Ruht sich aus'
    case 'relocating': return 'Im Umzug'
    case 'producing offspring':
      let eggType: string
      switch (queen.childType) {
        case 'drone': eggType = 'Drohnen-Eier'; break
        case 'worker': eggType = 'Arbeiterinnen-Eier'; break
        case 'soldier': eggType = 'Kämpferinnen-Eier'; break
        case 'queen': eggType = 'Königinnen-Eier'; break
        case undefined: eggType = err('Queen laying eggs without child type')
      }
      if (specific) {
        return `Legt ${queen.sexualFitness} ${eggType} pro Minute`
      } else {
        return `Legt ${eggType}`
      }
  }
}

export function printWorkerOccupation(worker: Ant<'worker'>): string {
  switch (worker.occupation) {
    case 'in egg': return 'Wird ausgebrütet'
    case 'growing up': return 'Im Wachstum'
    case 'relaxing': return 'Ruht sich aus'
    case 'relocating': return 'Im Umzug'

    case 'caring for offspring': return 'Kümmert sich um den Nachwuchs'
    case 'cracking seeds': return 'Öffnet Samenkapseln'
    case 'enhancing ant hill': return 'Renoviert'
    case 'gathering construction material': return 'Beschafft Baumaterial'
    case 'gathering food': return 'Beschafft Nahrung'
    case 'milking lice': return 'Sammelt Honigtau'

    case 'fighting': return 'Kämpft'
    case 'sealing off ant hill': return 'Versiegelt den Ameisenbau'
    case 'unsealing ant hill': return 'Öffnet die Eingänge'
  }
}
