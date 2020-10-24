import { gram, no_unit, Unit } from "./units"

export type FoodName = 'seeds' | 'cracked_seeds' | 'honeydew'

export interface Food {
    name: FoodName
    unit: Unit,

    nutritional_value: number
    protein: number
    carbs: number
    fat: number

    edible: boolean
    storable: boolean
}

export const foods: { [key in FoodName]: Food } = {
    seeds: {
        name: 'seeds',
        unit: no_unit,
        nutritional_value: 1,
        protein: 0.3,
        carbs: 0.3,
        fat: 0.4,
        edible: false, // needs to be cracked
        storable: true,
    },
    cracked_seeds: {
        name: 'cracked_seeds',
        unit: no_unit,
        nutritional_value: 1,
        protein: 0.3,
        carbs: 0.3,
        fat: 0.4,
        edible: true,
        storable: true,
    },
    honeydew: {
        name: 'honeydew',
        unit: gram,
        nutritional_value: 3,
        protein: 0.4,
        carbs: 2.5,
        fat: 0.1,
        edible: true,
        storable: false,
    }
}
