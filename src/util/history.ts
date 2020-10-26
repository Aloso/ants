export namespace History {
  export interface Id {
    isHome: boolean
    date: number
    random: string
  }

  export async function setup(): Promise<void> {
    return new Promise(resolve => {
      const goBackIfNotHome = (state: any) => {
        if (isId(state) && !state.isHome) {
          console.log('history.back()')
          setTimeout(() => {
            history.back()
            setTimeout(() => goBackIfNotHome(history.state), 30)
          }, 30)
        } else {
          history.replaceState(id(true), '')
          resolve()
        }
      }
      goBackIfNotHome(history.state)
    })
  }


  function id(isHome: boolean): Id {
    const rand = Math.floor((1 + Math.random()) * 1000000000000000)
    return {
      isHome,
      date: +new Date(),
      random: ('' + rand).substr(1),
    }
  }

  function isId(id: any): id is Id {
    return id != null &&
      typeof id.isHome === 'boolean' &&
      typeof id.date === 'number' &&
      typeof id.random === 'string'
  }

  function idsEqual(id1: Id, id2: Id): boolean {
    return id1.isHome === id2.isHome &&
      id1.date === id2.date &&
      id1.random === id2.random
  }

  const dummyId = id(false)

  export function push(callback: () => unknown, isHome = false) {
    const hid = id(isHome)
    const previous = document.title

    history.replaceState(hid, '')
    history.pushState(dummyId, '')

    function listener(event: PopStateEvent) {
      if (idsEqual(event.state, hid)) {
        document.title = previous
        window.removeEventListener('popstate', listener)
        callback()
      }
    }

    window.addEventListener('popstate', listener)
  }
}
