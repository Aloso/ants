
export interface Unit {
    format(number: number): string
}

class NoUnit implements Unit {
    format(number: number): string {
        return format(number, [], '', 3)
    }
}

class Gram implements Unit {
    format(number: number): string {
        return format(number, ['g', 'kg', 't'], 't', 3)
    }
}

export const no_unit: Unit = new NoUnit()
export const gram: Unit = new Gram()

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const len = alphabet.length

function generateScalePrefix(idx: number): string {
    if (idx < len) return alphabet[idx]
    let result = ''
    while (idx > 0) {
        const next_char = idx < len ? alphabet[(idx % len) - 1] : alphabet[idx % len]
        result = next_char + result
        idx = (idx / len) | 0
    }
    return result
}

export function format(number: number, units: string[], unit_suffix: string, precision: number): string {
    let idx = 0
    while (Math.round(number) >= 1000) {
        idx += 1
        number /= 1000
    }
    const num = number.toPrecision(precision)
    const num_short = num.includes('.') ? num.replace(/\.?0+$/, '') : num

    if (idx < units.length) return `${num_short} ${units[idx]}`
    else return `${num_short} <span class="scale-prefix">${generateScalePrefix(idx - units.length)}</span>${unit_suffix}`
}
