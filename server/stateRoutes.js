import ssr from './server'

// Начальное состояние - счетчик = 5
const initialState = {
    count: 5
}

export default function (app) {
    // Для любого пути отсылаем шаблон по умолчанию
    // ssr - функция, возвращающая сгенерированный HTML
    app.get('*', (req, res) => {
        const response = ssr(req.url, initialState)
        res.send(response)
    })
}
