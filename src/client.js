import React from 'react'
import {hydrate} from 'react-dom'
import {BrowserRouter} from 'react-router-dom'
import App from './app/App'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import purple from '@material-ui/core/colors/purple'
import Loadable from 'react-loadable'

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

// Оборачиваем приложение созданной темой
Loadable.preloadReady().then(() => {
    hydrate(
        <MuiThemeProvider theme={theme}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </MuiThemeProvider>,
        document.querySelector('#app')
    )
})
