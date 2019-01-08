import React from 'react'
import {Helmet} from 'react-helmet'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as Actions from '&/redux/actions'

import Header from './Header'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import NewsItem from "../app/NewsItem";
import {hydrate} from 'react-dom'
import {withStyles} from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import InfiniteScroll from 'react-infinite-scroller';
import ThemeProvider from '@material-ui/styles/ThemeProvider'
import StylesProvider from '@material-ui/styles/StylesProvider'
import createThemeContext from "~/themeContext";

const styles = {
    paper: {
        margin: "auto",
        marginTop: 20,
        width: "90%",
        padding: 15
    },
    btnLeft: {
        marginRight: 20
    }
}

const {theme, generateClassName} = createThemeContext();

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.increase = this.increase.bind(this)
        this.decrease = this.decrease.bind(this)
        this.loadNews = this.loadNews.bind(this)
        this.state = {
            news: props.news
        }
    }

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
                <Header/>
                <Helmet>
                    <title>VaMax Mobile</title>
                    <meta name="description" content="VaMax Mobile App"/>
                </Helmet>
                <Paper elevation={4} style={styles.paper} align="center">
                    <Typography variant="h5">Redux-Counter</Typography>
                    <Typography variant="subtitle1">Counter: {this.props.count}</Typography>
                    <br/>
                    <Button variant="contained" color="primary" onClick={this.increase}
                            style={styles.btnLeft}>Increase</Button>
                    <Button variant="contained" color="primary" onClick={this.decrease}>Decrease</Button>
                </Paper>

                <div className={classes.root} style={{marginTop: "20px"}}>
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={this.loadNews}
                        hasMore={true}
                        loader={<div className="loader" key={0}>Loading ...</div>}
                    >
                        <Grid
                            container
                            direction="column"
                            justify="center"
                            alignItems="center"
                        >
                            {news.map((i) => {
                                if (i.markup) {
                                    return <div id={i.state.id} key={i.state.id}
                                                dangerouslySetInnerHTML={{__html: i.markup}}/>
                                } else {
                                    return <NewsItem id={i.state.id} key={i.state.id} {...i.state}/>
                                }
                            })}
                        </Grid>
                    </InfiniteScroll>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    count: state.count,
    news: state.news
})
const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(Actions, dispatch)
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Home))
