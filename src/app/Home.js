import React from 'react'
import {Helmet} from 'react-helmet'

export default function Home() {
    return (
        <div>
            <Helmet>
                <title>Universal Page</title>
                <meta name="description" content="Modern Web App - Home Page"/>
            </Helmet>
            <h1>
                Welcome to the page of Universal Web App
            </h1>
        </div>
    )
}

