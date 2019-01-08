import ssr from './server'
import MobileDetect from 'mobile-detect'
import {v4} from 'uuid';

// Начальное состояние - счетчик = 5
const initialState = {
    count: 5,
    mobile: null,
    news: []
}

export default function (app) {
    for (let i = 0; i < 20; i++) {
        initialState.news.push({state:{id: v4(), title: 'Title ' + v4()}})
    }

    // Для любого пути отсылаем шаблон по умолчанию
    // ssr - функция, возвращающая сгенерированный HTML
    app.get('*', (req, res) => {
        // md == null, если компуктер, иначе мобильное устройство
        const md = new MobileDetect(req.headers['user-agent'])
        const response = ssr(req.url, initialState, md.mobile())
        res.send(response)
    })
}
