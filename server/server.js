import '~/bootstrap'
import React from 'react'
import {renderToStaticMarkup, renderToString} from 'react-dom/server'
import {StaticRouter} from 'react-router-dom'
import {Helmet} from 'react-helmet'
// Импортируем все необходимое для material-ui
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
import ThemeProvider from '@material-ui/styles/ThemeProvider'
import StylesProvider from '@material-ui/styles/StylesProvider'
import createThemeContext from '~/themeContext'
import {SheetsRegistry} from 'jss';
import {generateNews} from '~/stub'

export function renderIndex(initialState, url, mobile) {
    // Создаем стор
    let store = configureStore(initialState);
    const reactRouterContext = {};
    let modules = []
    const sheetsRegistry = new SheetsRegistry();
    const {theme, generateClassName} = createThemeContext();

    let content = renderToString(
        <StaticRouter location={url} context={reactRouterContext}>
            <Provider store={store}>
                <StylesProvider generateClassName={generateClassName} sheetsRegistry={sheetsRegistry}
                                sheetsManager={new Map()}>
                    <ThemeProvider theme={theme}>
                        <Loadable.Capture report={moduleName => modules.push(moduleName)}>
                            {mobile === null ? <App/> : <MobileApp/>}
                        </Loadable.Capture>
                    </ThemeProvider>
                </StylesProvider>
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

export function renderNews(page) {
    const {theme, generateClassName} = createThemeContext();

    return {
        ...page,
        content: page.content.map(item => {
            return {
                ...item,
                markup: renderToString(
                    <StylesProvider generateClassName={generateClassName} sheetsManager={new Map()}>
                        <ThemeProvider theme={theme}>
                            <NewsItem {...item}/>
                        </ThemeProvider>
                    </StylesProvider>
                )
            }
        })
    };
}
