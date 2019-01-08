import {renderIndex, renderNews} from './server'
import MobileDetect from 'mobile-detect'
import {v4} from 'uuid';
import {generateNews} from '~/stub'

// Начальное состояние - счетчик = 5
const initialState = {
    count: 5,
    mobile: null
}

export default function (app) {


    // Для любого пути отсылаем шаблон по умолчанию
    // ssr - функция, возвращающая сгенерированный HTML
    app.get('/', (req, res) => {

        initialState.page = generateNews(req.query.page);


        // md == null, если компуктер, иначе мобильное устройство
        const md = new MobileDetect(req.headers['user-agent'])
        const response = renderIndex(initialState, req.url, md.mobile())
        res.send(response)
    })

    app.get('/news', (req, res) => {

        let page = generateNews(req.query.page);

        const response = renderNews(page)
        res.send(response)
    })
}
