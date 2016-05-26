import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as BookActions from '../../actions/books'

import Book from './book/Book'
import styles from './books.css'

class Books extends Component {
  static fetchData(dispatch, params, userId, cookie) {
    return dispatch(BookActions.fetch(userId, cookie))
  };
  
  componentDidMount() {
  	const { actions, books, userId } = this.props

  	if(books.status == null) {
  		actions.books.fetch(userId)
  	}
  }
  
  render() {
    const { books } = this.props

    return <div className={styles.block}>
      <span className={styles.title}>
        Список книг ({books.value.length}):
      </span>
      {this.renderStatus()}
    </div>
  }
  
  renderStatus = () => {
    const { books, userId, actions } = this.props
    
    switch(books.status) {
      case 'pending':
        return <span className={styles.pending}>Загрузка...</span>
        
      case 'rejected':
        return <span className={styles.error}>Произошла ошибка</span>
      
      case 'fulfilled':
        const bookHtml = books.value.map(book => {
          return <Book 
            key={book._id}
            book={book}
            userId={userId}
            actions={actions} />
        })

        return <div>
          <table className={styles.book_list}>
            <tbody>{bookHtml}</tbody>
          </table>
          <input ref="name" placeholder="Название" />
          <input ref="author" placeholder="Автор" />
          <input ref="price" placeholder="Цена" />
          <a href="#" onClick={this.add}>Добавить книгу</a>
        </div>
        
      default:
        null
    }
  };
  
  add = () => {
    const { name, author, price } = this.refs
    if(!name.value || !author.value || !price.value)
      return
    
    const newBook = {
      name: name.value,
      author: author.value,
      price: price.value
    }
    
    this.props.actions.books.add(this.props.userId, newBook)
    name.value = author.value = price.value = ""
  };
}


export default connect(
  state => ({ 
    books: state.books,
    userId: state.auth.userId
  }),
  dispatch => ({
    actions: { 
      books: bindActionCreators(BookActions, dispatch) 
    }
  })
)(Books)