import React from 'react'
import {Helmet} from 'react-helmet'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as Actions from '&/redux/actions'
import {hydrate} from 'react-dom'

import Header from './Header'

import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import NewsItem from "./NewsItem";
import InfiniteScroll from 'react-infinite-scroller';
import LinearProgress from '@material-ui/core/LinearProgress';
import createThemeContext from "~/themeContext";
import ThemeProvider from '@material-ui/styles/ThemeProvider'
import StylesProvider from '@material-ui/styles/StylesProvider'

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
const {theme, generateClassName} = createThemeContext();

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.increase = this.increase.bind(this)
        this.decrease = this.decrease.bind(this)
        this.loadNews = this.loadNews.bind(this)

        this.state = {
            news: props.news
        };
    }

    // Функции вызывают dispatch на действия increase или decrease
    increase() {
        this.props.actions.increase()
    }

    decrease() {
        this.props.actions.decrease()
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
                    newsItems.forEach((item) => {
                        hydrate(
                            <StylesProvider generateClassName={generateClassName}>
                                <ThemeProvider theme={theme}>
                                    <NewsItem {...item.state}/>
                                </ThemeProvider>
                            </StylesProvider>, document.getElementById(item.state.id))

                    })
                })
            });
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
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={this.loadNews}
                            hasMore={true}
                            loader={<Grid key="news-progressbar" item xs={12}
                                          style={{marginTop: "20px"}}><LinearProgress/></Grid>}>
                            {news.map((i) => {
                                if (i.markup) {
                                    return <div id={i.state.id} key={i.state.id}
                                                dangerouslySetInnerHTML={{__html: i.markup}}/>
                                } else {
                                    return <NewsItem id={i.state.id} key={i.state.id} {...i.state}/>
                                }
                            })}
                        </InfiniteScroll>
                    </Grid>
                </div>
            </div>
        )
    }
}

// Добавляем в props счетчик
const mapStateToProps = (state) => ({
    count: state.count,
    news: state.news
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
)(withStyles(styles)(Home))