export interface OccupationMap {
    queen: QueenOccupation
    drone: DroneOccupation
    worker: WorkerOccupation
    soldier: SoldierOccupation
}

export type AntKind = keyof OccupationMap

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
        public sexuel_fitness: number,
        public size: number,
        public strength: number,
        public speed: number,

        public readonly birthday: number,
        public health: number,
        public restedness: number,

        public protein_level: number,
        public carb_level: number,
        public fat_level: number,

        public occupation: OccupationMap[K],
    ) { }
}

export class Game { }
