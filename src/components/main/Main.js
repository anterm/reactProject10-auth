import React, { Component } from 'react'

import styles from './main.css'

export default class Main extends Component {
  state = {
    counter: 0
  };
  
  render() {
    return <div className={styles.block}>
      <div className={styles.title}>Самая главная страница</div>
      <button className={styles.button_reset} onClick={this.reset}>Сброс</button>
      <button className={styles.button_dec} onClick={this.dec}>Уменьшить</button>
      <button className={styles.button_inc} onClick={this.inc}>Увеличить</button>
      <span className={styles.counter}>{this.state.counter}</span>
    </div>
  }
  
  reset = () => {
    this.setState({ counter: 0 })
  };
  
  inc = () => {
    this.setState({ counter: this.state.counter + 1 })
  };
  
  dec = () => {
    this.setState({ counter: this.state.counter - 1 })
  };
}