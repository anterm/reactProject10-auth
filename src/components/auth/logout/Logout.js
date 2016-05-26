import React, {Component, PropTypes} from 'react'
import { Link } from 'react-router'

import { logout } from '../../../actions/auth'
import { setDefaultBookState  } from '../../../actions/books'


class Logout extends Component {
	render() {
		return <Link className={this.props.className} to="/" onClick={() => this.handle()}>Выйти</Link>
	}

	handle() {
		this.props.dispatch(logout())
		this.props.dispatch(setDefaultBookState())
	}
}