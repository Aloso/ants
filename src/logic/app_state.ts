import { connect_db, IDBSuccessEvent, request } from './database'

export async function setup_global_state(): Promise<AppState> {
    const db = await connect_db('AntData', { version: 1 })

    const req = db.transaction('globalData', 'readwrite').objectStore('globalData').get(0)
    const obj: AppStateObject | null = (await request(req)).target.result

    return new AppState(db, obj ?? { name: null, intro_id: 0 })
}

interface AppStateObject {
    name: string | null
    intro_id: number
}

export class AppState {
    private _name: string | null = null
    private _intro_id = 0

    constructor(private readonly db: IDBDatabase, init: AppStateObject) {
        this._name = init.name === '' ? null : (init.name ?? null)
        this._intro_id = init.intro_id ?? 0
    }

    get name(): string | null {
        return this._name
    }
    set name(name: string | null) {
        const name_ = name?.trim() ?? null
        this._name = name_ === '' ? null : name_
        this.update_global().catch(console.error)
    }

    get intro_id(): number {
        return this._intro_id
    }
    set intro_id(id: number) {
        this._intro_id = id
        this.update_global().catch(console.error)
    }

    reset() {
        indexedDB.deleteDatabase('AntData')
    }

    private async update_global(): Promise<IDBSuccessEvent> {
        const globalData = this.db.transaction('globalData', 'readwrite').objectStore('globalData')
        const state: AppStateObject = {
            name: this.name,
            intro_id: this.intro_id,
        }
        return await request(globalData.put(state, 0))
    }
}
