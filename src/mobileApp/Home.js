import React from 'react'
import {Helmet} from 'react-helmet'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as Actions from '&/redux/actions'
import {hydrate} from 'react-dom'
import Header from './Header'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import NewsItem from "../app/NewsItem";
import {withStyles} from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import InfiniteScroll from 'react-infinite-scroller';
import LinearProgress from '@material-ui/core/LinearProgress';
import ThemeProvider from '@material-ui/styles/ThemeProvider'
import StylesProvider from '@material-ui/styles/StylesProvider'
import createThemeContext from "~/themeContext";
import ReactPaginate from 'react-paginate';


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
        this.loadPage = this.loadPage.bind(this)
        this.onPageChange = this.onPageChange.bind(this)

        this.state = {
            page: props.page
        };
    }

    increase() {
        this.props.actions.increase()
    }

    decrease() {
        this.props.actions.decrease()
    }

    static hrefBuilder(page) {
        return `/?page=${page}`;
    }

    onPageChange(page) {
        this.props.history.push(`/?page=${page.selected + 1}`)
    }

    loadPage() {
        fetch(`/news?page=${this.state.page.number + 1}`)
            .then((response) => {
                return response.json()
            })
            .then((page) => {
                this.setState((prevState) => {
                    return {
                        ...prevState,
                        page: {
                            ...page,
                            content: [...prevState.page.content, ...page.content]
                        }
                    }
                }, () => {
                    page.content.forEach((item) => {
                        hydrate(
                            <StylesProvider generateClassName={generateClassName}>
                                <ThemeProvider theme={theme}>
                                    <NewsItem {...item}/>
                                </ThemeProvider>
                            </StylesProvider>, document.getElementById(item.id))

                    })
                })
            });
    }

    render() {
        const {page} = this.state;
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
                    <Grid
                        container
                        direction="column"
                        justify="center"
                        alignItems="center"
                    >
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={this.loadPage}
                            hasMore={page.hasNext}
                            loader={<Grid key="news-progressbar" item xs={12}
                                          style={{marginTop: "20px"}}><LinearProgress/></Grid>}>
                            {page.content.map((i) => {
                                if (i.markup) {
                                    return <div id={i.id} key={i.id}
                                                dangerouslySetInnerHTML={{__html: i.markup}}/>
                                } else {
                                    return <NewsItem id={i.id} key={i.id} {...i}/>
                                }
                            })}
                        </InfiniteScroll>
                        <ReactPaginate
                            previousLabel={"<-"}
                            nextLabel={"->"}
                            pageCount={page.totalPages}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={10}
                            onPageChange={this.onPageChange}
                            containerClassName={"pagination"}
                            subContainerClassName={"pages pagination"}
                            hrefBuilder={Home.hrefBuilder}
                            activeClassName={"active"}
                            forcePage={page.number - 1}/>
                    </Grid>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    count: state.count,
    page: state.page
})
const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(Actions, dispatch)
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Home))
