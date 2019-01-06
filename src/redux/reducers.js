import {DECREASE, INCREASE} from './actions'

export default function count(state, action) {
    switch (action.type) {
        case INCREASE:
            // Если наш action = INCREASE - увеличиваем state.count на 1
            return Object.assign({}, state, {
                count: state.count + 1
            })
        case DECREASE:
            // Если DECREASE - уменьшаем на 1. Так получается счетчик
            return Object.assign({}, state, {
                count: state.count - 1
            })
        default:
            // По умолчанию возвращаем предыдущее состояние
            return state
    }
}