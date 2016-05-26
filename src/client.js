import React from 'react'
import { render } from 'react-dom'
import { Router, match, browserHistory as history } from 'react-router'

import { Provider } from 'react-redux'
import configureStore from './store'

const initialState = window.__INITIAL_STATE__
const store = configureStore(initialState)

const routes = require('./routes')(
	() => store.getState().auth.isLogged
)

match({ routes, history }, (error, redirectLocation, renderProps) => {
	render(
		<Provider store={store}>
			<Router {...renderProps}>
				{routes}
			</Router>
	  </Provider>,
		document.getElementById('content')
	)
})