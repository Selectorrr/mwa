import ssr from './server'

export default function (app) {
    // Для любого пути отсылаем шаблон по умолчанию
    // ssr - функция, возвращающая сгенерированный HTML
    app.get('*', (req, res) => {
        const response = ssr(req.url)
        res.send(response)
    })
}
