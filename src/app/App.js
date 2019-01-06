import React from 'react'
import {Route, Switch} from 'react-router'

import Loadable from 'react-loadable'
import Loading from '&/Loading'

const AsyncHome = Loadable({
    loader: () => import(/* webpackChunkName: "Home" */ './Home'),
    loading: Loading,
    delay: 300,
})
export default function App() {
    return (
        <Switch>
            <Route exact path="/" component={AsyncHome}/>
        </Switch>
    )
}
