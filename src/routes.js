// полифил для серверной части
if(typeof require.ensure !== 'function') 
	require.ensure = (d, c) => c(require)
  
module.exports = isLogged => ({
  path: "/",
  component: require('./components/App').default,
  
  getIndexRoute(location, callback) {
    require.ensure([], require => {
      callback(null, {
        component: require('./components/main/Main').default,
      })
    }, 'main')
  },
  
  childRoutes: [
    {
      path: 'books',
      
      onEnter: (nextState, replace) => {
        if(!isLogged()) 
          replace("/login?redirect=" + nextState.location.pathname)
      },
        
      getComponent(location, cb) {
        require.ensure([], require => {
          cb(null, require('./components/books/Books').default)
        }, 'books')
      }
    },
    {
      path: 'about',
      getComponent(location, cb) {
        require.ensure([], require => {
          cb(null, require('./components/about/About').default)
        }, 'about')
      }
    },
    {
      path: 'login',
      
      onEnter: (nextState, replace) => {
        if(isLogged()) 
          replace("/")
      },
      
      getComponent(location, cb) {
        require.ensure([], require => {
          cb(null, require('./components/auth/login/Login').default)
        }, 'login')
      }
    }
  ]
})