import React from 'react'
import {renderToString} from 'react-dom/server'
import {StaticRouter} from 'react-router-dom'
import {Helmet} from 'react-helmet'
// Импортируем все необходимое для material-ui
import {JssProvider, SheetsRegistry} from 'react-jss'
import {createGenerateClassName, createMuiTheme, MuiThemeProvider,} from '@material-ui/core/styles'
import purple from '@material-ui/core/colors/purple'
import Loadable from 'react-loadable'
import {getBundles} from 'react-loadable/webpack'
import stats from '~/public/react-loadable.json'

import App from '&/app/App'
import template from './template'

export default function render(url) {

    const reactRouterContext = {}

    //Создаем объект sheetsRegistry - пока он пустой
    const sheetsRegistry = new SheetsRegistry()
    const sheetsManager = new Map()
    // Создаем тему - можно настроить на любой вкус и цвет
    const theme = createMuiTheme({
        palette: {
            primary: purple,
            secondary: {
                main: '#f44336',
            },
        },
        // Это нужно только для версий 3.*.*. Когда будет v4 - удалить
        typography: {
            useNextVariants: true,
        },
    })
    const generateClassName = createGenerateClassName()
    let modules = []
    // Создаем обертку для приложения
// Собираем отрендеренные модули в массив modules
    let content = renderToString(
        <StaticRouter location={url} context={reactRouterContext}>
            <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
                <MuiThemeProvider theme={theme} sheetsManager={sheetsManager}>
                    <Loadable.Capture report={moduleName => modules.push(moduleName)}>
                        <App/>
                    </Loadable.Capture>
                </MuiThemeProvider>
            </JssProvider>
        </StaticRouter>
    )

    const helmet = Helmet.renderStatic()

    // Превращаем модули в бандлы (рассказано дальше)
    let bundles = getBundles(stats, modules)
    // И передаем в HTML-шаблон
    // Передаем sheetsRegistry в шаблон для дальнейшего внедрения в серверный html
    return template(helmet, content, sheetsRegistry, bundles)
}
