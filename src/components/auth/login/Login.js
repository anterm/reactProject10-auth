import React, {Component} from 'react'
import { connect } from 'react-redux'

import { auth } from '../../../actions/auth'
import styles from './login.css'

class Login extends Component {
  render() {
		const { isLogged, status } = this.props.auth
		const disabled = status === 'pending'
		const loginButtonCss = styles['login_button_' + (
			status === 'pending' ? 'disabled' : 'active'
		)]
		
		return <div className={styles.block}>
			<div className={styles.social_buttons}>
				<a className={styles.link} href="/api/auth/vkontakte">
					<span className={styles.vk_icon}></span>
				</a>
				<a className={styles.link} href="/api/auth/twitter">
					<span className={styles.twitter_icon}></span>
				</a>
				<a className={styles.link} href="/api/auth/facebook">
					<span className={styles.facebook_icon}></span>
				</a>
			</div>

			<div className={styles.inputs}>
				<input type='text' ref="username" placeholder="Имя" />
				<input type='password' ref="password" placeholder="Пароль" />
			</div>

			<div className={styles.login_buttons}>
				<button className={loginButtonCss} disabled={disabled} onClick={() => this.auth('login')}>Войти</button>
				<button className={loginButtonCss} disabled={disabled} onClick={() => this.auth('signup')}>Регистрация</button>
			</div>

			<div className={styles.loading}>
				{this.renderByStatus()}
			</div>
			
		</div>
	}
	
	renderByStatus() {
		const { auth } = this.props
		switch(auth.status) {
			case 'pending':
				return <span>Проверка</span> 
			case 'rejected':
				return <div>{auth.errors.map((error, i) => <div key={i}>{error}</div>)}</div>
			default:
				null
		}
	}
	
	componentWillReceiveProps(nextProps) {
		if(nextProps.auth.status === 'rejected') {
			switch(nextProps.auth.errors[0]) {
				case 'Неверный пароль!':
					this.refs.password.value = ""
					break;
					
				case 'Имя уже занято!':
				case 'Пользователя с таким именем нет!':
					this.refs.password.value = ""
					this.refs.username.value = ""
					break;
			}
		}
	}
	
	auth(type) {
		const username = this.refs.username.value.trim().substr(0, 32)
		const password = this.refs.password.value.trim().substr(0, 100)
		
		const errors = []
		if(username.length <= 5)
		 	 errors.push('Имя должно содержать больше 5 символов!')
		if(password.length <= 5)
		 	 errors.push('Пароль должен содержать больше 5 символов!')
		
		if(!errors.length) {
			this.props.authActions.request(type, { username, password }).then(
				response => {
					const redirect = this.props.location.query.redirect || "/"
					this.context.router.replace(redirect)
				}
			)
		}
		else
			this.props.authActions.reject(errors)
	}
}

Login.contextTypes = {
	router: React.PropTypes.object.isRequired
}

export default connect(
	state => ({
		auth: state.auth
	}),
  
	dispatch => ({
		authActions: {
		  request: (type, data) => dispatch(auth(type, data)),
			reject: errors => dispatch({ type: "LOGIN_CLIENT_FAILURE", errors })
    }
  })
)(Login)