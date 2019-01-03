import React from 'react'
import {renderToString} from 'react-dom/server'
import {StaticRouter} from 'react-router-dom'
import {Helmet} from 'react-helmet'

import App from '&/app/App'
import template from './template'

export default function render(url) {

    //Объект хранит в себе результат рендера
    const reactRouterContext = {}

    // Превращаем контент в строку HTML
    let content = renderToString(
        <StaticRouter location={url} context={reactRouterContext}>
            <App/>
        </StaticRouter>
    )

    // Достаем <head> из HTML-строки
    const helmet = Helmet.renderStatic()

    //Передаем контент в HTML-шаблон и возвращаем сгенерированную страницу
    return template(helmet, content)
}
