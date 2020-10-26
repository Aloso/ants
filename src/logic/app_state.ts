import { connectDb, IDBSuccessEvent, request } from './database'

export async function setupGlobalState(): Promise<AppState> {
  const db = await connectDb('AntData', { version: 2 })

  const req = db.transaction('globalData', 'readwrite').objectStore('globalData').get(0)
  const obj: AppStateObject | null = (await request(req)).target.result

  return new AppState(db, obj ?? { name: null, introShown: false })
}

interface AppStateObject {
  name: string | null
  introShown: boolean
}

export class AppState {
  private _name: string | null = null
  private _introShown = false

  constructor(private readonly db: IDBDatabase, init: AppStateObject) {
    this._name = init.name === '' ? null : (init.name ?? null)
    this._introShown = init.introShown
  }

  get name(): string | null {
    return this._name
  }
  set name(name: string | null) {
    const _name = name?.trim() ?? null
    this._name = _name === '' ? null : _name
    this.updateGlobal().catch(console.error)
  }

  get introShown(): boolean {
    return this._introShown
  }
  set introShown(id: boolean) {
    this._introShown = id
    this.updateGlobal().catch(console.error)
  }

  reset() {
    indexedDB.deleteDatabase('AntData')
  }

  private async updateGlobal(): Promise<IDBSuccessEvent> {
    const globalData = this.db.transaction('globalData', 'readwrite').objectStore('globalData')
    const state: AppStateObject = {
      name: this.name,
      introShown: this.introShown,
    }
    return await request(globalData.put(state, 0))
  }
}
