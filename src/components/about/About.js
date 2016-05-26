import React, { Component } from 'react'

import styles from './about.css'

export default class About extends Component {
  render() {
    return <div className={styles.block}>
      <div className={styles.text}>
        Что же мы можем о себе рассказать? Да, собственно, ничего.
      </div>
    </div>
  }
}