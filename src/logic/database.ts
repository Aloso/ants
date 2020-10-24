
export function connect_db(name: string, options: { version: number }): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(name, options.version)

        request.onerror = function (event: any) {
            alert(`Öffnen der Datenbank fehlgeschlagen\nGrund: ${event.target.error})\n\nBitte melden Sie diesen Fehler.`)
            reject(event.target)
        }
        request.onsuccess = function (event: any) {
            resolve(event.target.result)
        }
        request.onupgradeneeded = function (event: any) {
            console.log('upgrade DB')

            const db: IDBDatabase = event.target.result
            const globalData = db.createObjectStore('globalData')

            globalData.transaction.oncomplete = function (_event: any) {
                resolve(db)
            }
        }
    })
}

export type IDBSuccessEvent = Event & {
    target: EventTarget & { result?: any }
}

export function request(request: IDBRequest): Promise<IDBSuccessEvent> {
    return new Promise((resolve, reject) => {
        request.onerror = reject
        request.onsuccess = resolve as any
    })
}
