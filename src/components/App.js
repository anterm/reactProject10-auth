import React, {Component} from 'react'

import Header from './layout/header/Header'
import Footer from './layout/footer/Footer'

import styles from './app.css'

export default class App extends Component {
 	render() {
 		return <div className={styles.block}>
 			<Header />
 			{this.props.children}
 			<Footer />
 		</div>
 	}
}