import React, {Component} from 'react'
import styles from './book.css'

export default class Book extends Component {
  state = {
    isEditable: false
  };
  
  render() {
    const { book } = this.props
    
    return !this.state.isEditable
      ? <tr key={book._id}>
          <td>{book.name}</td>
          <td>{book.author}</td>
          <td>{book.price}</td>
          <td><a href="#" onClick={this.startEdit}>изменить</a></td>
          <td><a href="#" onClick={this.remove}>удалить</a></td>
        </tr>
      : <tr key={book._id}>
        <td><input ref="name" defaultValue={book.name} /></td>
        <td><input ref="author" defaultValue={book.author} /></td>
        <td><input ref="price" defaultValue={book.price} /></td>
        <td><a href="#" onClick={this.stopEdit}>отмена</a></td>
        <td><a href="#" onClick={this.save}>сохранить</a></td>
      </tr>
  }
  
  startEdit = () => {
    this.setState({ isEditable: true })
  };
  
  stopEdit = () => {
    this.setState({ isEditable: false })
  };
  
  remove = () => {
    const { book, userId, actions } = this.props
    actions.books.remove(userId, book._id)
  };
  
  save = () => {
    const { userId, actions } = this.props
    const { name, author, price } = this.refs
    
    const book = {
      name: name.value,
      author: author.value,
      price: parseInt(price.value) || 0,
      _id: this.props.book._id
    }
    
    actions.books.change(userId, book)
    this.setState({ isEditable: false })
  };
}