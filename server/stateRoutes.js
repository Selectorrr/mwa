import ssr from './server'
import MobileDetect from 'mobile-detect'

// Начальное состояние - счетчик = 5
const initialState = {
    count: 5,
    mobile: null
}

export default function (app) {
    // Для любого пути отсылаем шаблон по умолчанию
    // ssr - функция, возвращающая сгенерированный HTML
    app.get('*', (req, res) => {
        // md == null, если компуктер, иначе мобильное устройство
        const md = new MobileDetect(req.headers['user-agent'])
        const response = ssr(req.url, initialState, md.mobile())
        res.send(response)
    })
}
