import '~/bootstrap'
import React from 'react'
import {hydrate} from 'react-dom'
import {BrowserRouter} from 'react-router-dom'
import Loadable from 'react-loadable'
import configureStore from './redux/configureStore'
import {Provider} from 'react-redux'
import App from "./app/App";
import MobileApp from "./mobileApp/App";
import createThemeContext from '~/themeContext'
import ThemeProvider from '@material-ui/styles/ThemeProvider'
import StylesProvider from '@material-ui/styles/StylesProvider'

const {theme, generateClassName} = createThemeContext();

// Буквально вытаскиваем initialState из "окна" и заново создаем стор
const state = window.__STATE__
const store = configureStore(state)

class Main extends React.Component {
    // Remove the server-side injected CSS.
    componentDidMount() {
        const jssStyles = document.getElementById('jss-server-side');
        if (jssStyles && jssStyles.parentNode) {
            jssStyles.parentNode.removeChild(jssStyles);
        }
    }

    render() {
        return (
            state.mobile === null ? <App/> : <MobileApp/>
        );
    }
}

// Оборачиваем приложение созданной темой
Loadable.preloadReady().then(() => {
    hydrate(
        <Provider store={store}>
            <BrowserRouter>
                <StylesProvider generateClassName={generateClassName}>
                    <ThemeProvider theme={theme}>
                        <Main/>
                    </ThemeProvider>
                </StylesProvider>
            </BrowserRouter>
        </Provider>,
        document.querySelector('#app')
    )
})
