const initialState = {
  status: null,
  value: [],
  error: null
}

export default (state = initialState, action) => {
  switch(action.type) {
    case 'BOOKS_REQUEST': {
      
      return {
        ...state, 
        status: "pending"
      }
    }
    
   case 'BOOKS_SUCCESS': {
      return {
        status: "fulfilled",
        value: action.response
      }
    }
    
   case 'BOOKS_FAILURE': {
      return {
        status: "rejected",
        error: actions.error,
        value: []
      }
    }
    
    case 'ADD_BOOK': {
      return {
        ...state,
        value: [...state.value, action.book]
      }
    }
    
    case 'CHANGE_BOOK': {
      const books = state.value.map(book => {
        return book._id === action.book._id ? action.book : book
      })
      
      return {
        ...state,
        value: books
      }
    }
    
    case 'REMOVE_BOOK': {
      return {
        ...state,
        value: state.value.filter(book => book._id !== action.id)
      }
    }
    
    case 'SET_DEFAULT_BOOK_STATE':
      return initialState
      
    default:
      return state
  }
}