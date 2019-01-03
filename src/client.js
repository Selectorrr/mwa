import React from 'react'
import {hydrate} from 'react-dom'
import {BrowserRouter} from 'react-router-dom'
import App from './app/App'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import purple from '@material-ui/core/colors/purple'
import Loadable from 'react-loadable'
import configureStore from './redux/configureStore'
import {Provider} from 'react-redux'
import MobileApp from "./mobileApp/App";

// Тема на клиенте должна быть такой же, как и на сервере
// При желании можно даже вынести в отдельный модуль
const theme = createMuiTheme({
    palette: {
        primary: purple,
        secondary: {
            main: '#f44336',
        },
    },
    typography: {
        useNextVariants: true,
    },
})

// Буквально вытаскиваем initialState из "окна" и заново создаем стор
const state = window.__STATE__
const store = configureStore(state)


// Оборачиваем приложение созданной темой
Loadable.preloadReady().then(() => {
    hydrate(
        <Provider store={store}>
            <MuiThemeProvider theme={theme}>
                <BrowserRouter>
                    {state.mobile === null ? <App/> : <MobileApp/>}
                </BrowserRouter>
            </MuiThemeProvider>
        </Provider>,
        document.querySelector('#app')
    )
})
