import config from '../../config/constants'
import asyncRequest from '../utils/request'


export const fetch = (userId, Cookie) => dispatch => {
	const params = { 
		url: `${config.site_url}/api/users/${userId}/books`
	}
	
	if(Cookie) params.headers = { Cookie }
	
	return dispatch({
	  types: ['BOOKS_REQUEST', 'BOOKS_SUCCESS', 'BOOKS_FAILURE'],
	  callAPI: () => asyncRequest(params)
	})
}


export const add = (userId, book) => dispatch => {
	const params = {
		url: `/api/users/${userId}/books`,
		method: "post",
		data: book
	}

	return asyncRequest(params).then(book => {
		dispatch({ type: 'ADD_BOOK', book })
		return book
	})
}


export const change = (userId, book) => dispatch => {
	const params = { 
		url: `/api/users/${userId}/books/${book._id}`,
		method: "put", 
		data: book 
	}

	return asyncRequest(params).then(() => {
		dispatch({ type: 'CHANGE_BOOK', book })
	})
}


export const remove = (userId, id) => dispatch => {
	const params = { 
		url: `/api/users/${userId}/books/${id}`,
		method: "del"
	}

	return asyncRequest(params).then(() => {
		dispatch({ type: 'REMOVE_BOOK', id })
	})
}

export function setDefaultBookState() {
	return { type: "SET_DEFAULT_BOOK_STATE" }
} 