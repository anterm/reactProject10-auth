import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { logout } from '../../../actions/auth'
import { setDefaultBookState  } from '../../../actions/books'

import styles from './header.css'

class Header extends Component {
	render() {
		const { auth } = this.props
		
		return <div className={styles.block}>
			<div className={styles.block_wrapper}>
				<Link className={styles.link} to="/">
					<span className={styles.icon_home}></span>
					Главная
				</Link>
				<Link className={styles.link} to="/books">
					<span className={styles.icon_books}></span>
					Книги
				</Link>
				<Link className={styles.link} to="/about">
					<span className={styles.icon_about}></span>
					О нас
				</Link>
				{auth.isLogged
					? <div className={styles.user}>
							<a className={styles.link} href="javascript:void(0);" onClick={this.logout}>
							Выйти
							</a>
							<span className={styles.user_info}>Привет, {auth.username}</span>
						</div>
					: <Link className={styles.link} to="/login">
							Войти
						</Link>
				}
			</div>
		</div>
	}
	
	logout = () => {
		this.props.dispatch(logout())
		this.props.dispatch(setDefaultBookState())
		this.context.router.replace("/login")
	};
}

Header.contextTypes = {
	router: React.PropTypes.object.isRequired
}

export default connect(
	state => ({ auth: state.auth })
)(Header)