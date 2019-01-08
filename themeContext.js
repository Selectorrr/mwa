// Create a theme instance.
import purple from "@material-ui/core/colors/purple";
import {createGenerateClassName, createMuiTheme} from "@material-ui/core/styles/index";

export default function createThemeContext() {
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
    });

// Create a new class name generator.
    const generateClassName = createGenerateClassName({
        dangerouslyUseGlobalCSS: true,
        productionPrefix: '',
    });
    return {theme, generateClassName}
}
