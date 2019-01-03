import React from 'react'
import {Route, Switch} from 'react-router'
import Home from './Home'

export default function App() {
    return (
        <Switch>
            <Route exact path="/" component={Home}/>
        </Switch>
    )
}
