import React from 'react'
import {Helmet} from 'react-helmet'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import Header from './Header'

// Inline styles - одно из самых удобных решений для css в react
const styles = {
    paper: {
        margin: "auto",
        marginTop: 200,
        width: "40%",
        padding: 15
    },
    btn: {
        marginRight: 20
    }
}

export default function Home() {
    return (
        <div>
            <Helmet>
                <title>Universal Material Page</title>
            </Helmet>
            <Header/>
            <Paper elevation={4} style={styles.paper} align="center">
                <Typography variant="h5">Universal Web App with Material-ui</Typography>
                <br/>
                <Button variant="contained" color="primary" style={styles.btn}>I like it!</Button>
            </Paper>
        </div>
    )
}