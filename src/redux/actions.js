// actions
export const INCREASE = 'INCREASE'
export const DECREASE = 'DECREASE'

// Создаем action creators
export function increase() {
    return {
        type: INCREASE
    }
}

export function decrease() {
    return {
        type: DECREASE
    }
}