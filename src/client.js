import React from 'react'
import {hydrate} from 'react-dom'
import {BrowserRouter} from 'react-router-dom'
import App from './app/App'
import purple from '@material-ui/core/colors/purple'
import {createGenerateClassName, createMuiTheme, MuiThemeProvider,} from '@material-ui/core/styles';
import {JssProvider} from 'react-jss'

class Main extends React.Component {
    // Remove the server-side injected CSS.
    componentDidMount() {
        const jssStyles = document.getElementById('jss-server-side');
        if (jssStyles && jssStyles.parentNode) {
            jssStyles.parentNode.removeChild(jssStyles);
        }
    }

    render() {
        return <App/>
    }
}


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

// Create a new class name generator.
const generateClassName = createGenerateClassName();

// Оборачиваем приложение созданной темой
hydrate(
    <BrowserRouter>
        <JssProvider generateClassName={generateClassName}>
            <MuiThemeProvider theme={theme}>
                <Main/>
            </MuiThemeProvider>
        </JssProvider>
    </BrowserRouter>,
    document.querySelector('#app')
)
