import React from 'react'
import {Helmet} from 'react-helmet'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as Actions from '&/redux/actions'
import {hydrate} from 'react-dom'

import Header from './Header'

import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import NewsItem from "./NewsItem";

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
});

class Home extends React.Component {
    constructor() {
        super()
        this.increase = this.increase.bind(this)
        this.decrease = this.decrease.bind(this)
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
                        hydrate(<NewsItem {...item.state}/>, document.getElementById(item.state.id).parentNode.parentNode)
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
                            return <div key={i.state.id  + "2"} dangerouslySetInnerHTML={{__html: i.markup}}/>
                        })}
                    </Grid>
                    {/*<Grid*/}
                        {/*container*/}
                        {/*direction="column"*/}
                        {/*justify="center"*/}
                        {/*alignItems="center"*/}
                    {/*>*/}
                        {/*{news.map((i, index) => {*/}
                            {/*return <NewsItem key={i.state.id + "1"}  id={"test"} title={"test"}/>*/}
                        {/*})}*/}
                    {/*</Grid>*/}
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
)(withStyles(styles)(Home))