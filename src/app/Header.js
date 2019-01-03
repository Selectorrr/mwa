import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

export default function Header() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h5" color="inherit">
                    Modern Web App
                </Typography>
            </Toolbar>
        </AppBar>
    )
}