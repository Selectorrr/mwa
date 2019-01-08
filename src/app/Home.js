import React from 'react'
import {Helmet} from 'react-helmet'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as Actions from '&/redux/actions'
import {hydrate} from 'react-dom'

import Header from './Header'

import PropTypes from 'prop-types';
import {createGenerateClassName, createMuiTheme, MuiThemeProvider, withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import NewsItem from "./NewsItem";
import purple from '@material-ui/core/colors/purple'
import {JssProvider, SheetsRegistry} from 'react-jss'

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }
});

class Home extends React.Component {
    constructor() {
        super()
        this.increase = this.increase.bind(this)
        this.decrease = this.decrease.bind(this)
        this.loadNews = this.loadNews.bind(this)
        this.state = {
            news: []
        }
    }

    // Функции вызывают dispatch на действия increase или decrease
    increase() {
        this.props.actions.increase()
    }

    decrease() {
        this.props.actions.decrease()
    }

    static createNewsItemStyleContext() {
        const generateClassName = createGenerateClassName({
            dangerouslyUseGlobalCSS: false
        });

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
        return {generateClassName, sheetsRegistry, sheetsManager, theme};
    }


    loadNews() {
        fetch(`/news`)
            .then((response) => {
                return response.json()
            })
            .then((newsItems) => {
                this.setState((prevState) => {
                    return {...prevState, news: [...prevState.news, ...newsItems]}
                }, () => {
                    const {generateClassName, sheetsRegistry, sheetsManager, theme} = Home.createNewsItemStyleContext();
                    newsItems.forEach((item) => {
                        hydrate(
                            <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
                                <MuiThemeProvider theme={theme} sheetsManager={sheetsManager}>
                                    <NewsItem {...item.state}/>
                                </MuiThemeProvider>
                            </JssProvider>
                            , document.getElementById(item.state.id).parentNode.parentNode)
                    })
                })
            });
    }

    componentDidMount() {
        this.loadNews()
    }

    render() {
        const {news} = this.state;
        const {classes} = this.props;
        return (
            <div>
                <Helmet>
                    <title>MWA - Home</title>
                    <meta name="description" content="Modern Web App - Home Page"/>
                </Helmet>
                <Header/>
                <div className={classes.root} style={{marginTop: "20px"}}>
                    <Grid
                        container
                        direction="column"
                        justify="center"
                        alignItems="center"
                    >
                        {news.map((i) => {
                            return <div key={i.state.id} dangerouslySetInnerHTML={{__html: i.markup}}/>
                        })}

                    </Grid>
                </div>
            </div>
        )
    }
}

// Добавляем в props счетчик
const mapStateToProps = (state) => ({
    count: state.count
})
// Добавляем actions к this.props
const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(Actions, dispatch)
})

Home.propTypes = {
    classes: PropTypes.object.isRequired,
};

// Используем react-redux connect для подключения к стору
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, {name: 'MobileHome'})(Home))