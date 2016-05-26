import asyncRequest from '../utils/request'

const authRequest = (url, data) => dispatch => {
  const params = { url, method: "post", data }

  return dispatch({
    types: ['LOGIN_REQUEST', 'LOGIN_SUCCESS', 'LOGIN_FAILURE'],
    callAPI: () => asyncRequest(params)
  })
}

// login or signup
export function auth(type, data) {
  return authRequest(`/api/auth/${type}`, data)
}

export function logout() {
  asyncRequest({ url: "/api/auth/logout" })
  return { type: "LOGOUT" }
}