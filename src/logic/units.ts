
export interface Unit {
  format(num: number): string
}

class NoUnit implements Unit {
  format(num: number): string {
    return format(num, [], '', 3)
  }
}

class Gram implements Unit {
  format(num: number): string {
    return format(num, ['g', 'kg', 't'], 't', 3)
  }
}

export const noUnit: Unit = new NoUnit()
export const gram: Unit = new Gram()

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const len = alphabet.length

function generateScalePrefix(idx: number): string {
  if (idx < len) return alphabet[idx]
  let result = ''
  while (idx > 0) {
    const nextChar = idx < len ? alphabet[(idx % len) - 1] : alphabet[idx % len]
    result = nextChar + result
    idx = Math.floor(idx / len)
  }
  return result
}

export function format(num: number, units: string[], unitSuffix: string, precision: number): string {
  let idx = 0
  while (Math.round(num) >= 1000) {
    idx += 1
    num /= 1000
  }
  const n = num.toPrecision(precision)
  const nShort = n.includes('.') ? n.replace(/\.?0+$/, '') : n

  if (idx < units.length) return `${nShort} ${units[idx]}`
  else return `${nShort} <span class="scale-prefix">${generateScalePrefix(idx - units.length)}</span>${unitSuffix}`
}
