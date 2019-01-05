import React from 'react'
import {renderToStaticMarkup, renderToString} from 'react-dom/server'
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
import {Provider} from 'react-redux'
import configureStore from '&/redux/configureStore'
import MobileApp from '&/mobileApp/App'
import NewsItem from "../src/app/NewsItem";
import {v4} from 'uuid';

const generateClassName = createGenerateClassName();

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

function renderIndex(initialState, url, mobile) {
    // Создаем стор
    let store = configureStore(initialState);
    const reactRouterContext = {};
    let modules = []
    // Создаем обертку для приложения
// Собираем отрендеренные модули в массив modules
// Redux Provider снабжает все приложение стором.
    let content = renderToString(
        <StaticRouter location={url} context={reactRouterContext}>
            <Provider store={store}>
                <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
                    <MuiThemeProvider theme={theme} sheetsManager={sheetsManager}>
                        <Loadable.Capture report={moduleName => modules.push(moduleName)}>
                            {mobile === null ? <App/> : <MobileApp/>}
                        </Loadable.Capture>
                    </MuiThemeProvider>
                </JssProvider>
            </Provider>
        </StaticRouter>
    )

    const helmet = Helmet.renderStatic()
    // Передаем клиенту информацию об устройстве пользователя
    initialState.mobile = mobile

    // Превращаем модули в бандлы (рассказано дальше)
    let bundles = getBundles(stats, modules)
    // И передаем в HTML-шаблон
    // Передаем sheetsRegistry в шаблон для дальнейшего внедрения в серверный html
    return template(helmet, content, sheetsRegistry, bundles, initialState)
}

export default function render(url, initialState, mobile) {
    if ("/" === url) {
        return renderIndex(initialState, url, mobile);
    } else if (url.toString().startsWith("/news")) {

        let states = [
        ];
        for (let i = 0; i < 100; i++) {
            states.push({id: v4(), title: 'Title ' + v4()})
        }
        return states.map(state => {
            return {
                state: state,
                markup: renderToString(<NewsItem {...state}/>)
            }
        });
    }
}
