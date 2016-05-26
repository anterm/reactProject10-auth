import React from 'react'
// для сервер-рендеринга
import { renderToString } from 'react-dom/server'
import { RouterContext, match } from 'react-router'

import { Provider } from 'react-redux'
import configureStore  from './src/store'

import mongoose from 'mongoose'

import path from 'path'
import webpack from 'webpack'
import config from './webpack.config'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import passport from 'passport'

import express from 'express'
const app = express();

mongoose.connect('mongodb://localhost/reactProject', (err, res) => {
  if(err) {
    console.log('error connecting to MongoDB Database. ' + err)
  } else {
    console.log('Connected to Database')
  }
})

// настройки для вебпака и dev-server'a
const compiler = webpack(config);
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}))

app.use(require('webpack-hot-middleware')(compiler))

// подключаем ejs шаблоны
app.set("views", path.resolve('views'))
app.set('view engine', 'ejs')

// путь к статическим файлам
app.use('/build', express.static(path.resolve('build')))

app.use(bodyParser.urlencoded({ extended: true })) 
app.use(bodyParser.json())
app.use(cookieParser())

require('./passport')(passport)

// По умолчанию, passport хранит сессии прямо в памяти,
// но это не предназначено для продакшна из-за утечек памяти.
// Поэтому нужно использовать другое хранилище, например, бд.
// Т.к. мы используем MongoDB - там и будем хранить, и поможет нам
// в этом connect-mongodb-session
// Вы можете выбрать другое хранилище, например, Redis.
const MongoStore = require('connect-mongodb-session')(session)

app.use(session({
  // БД для хранения сессий
  store: new MongoStore(
    {
      uri: 'mongodb://localhost/reactProject',
      // имя коллекции, по умолчанию 'sessions'
      collection: 'sessions',
      
      expires: 1000 * 60 * 60 * 24 // 1 day
    },
    // здесь можно перехватить ошибки, если они произошли в бд
    (error) => {}
  ),
  // укажите здесь своё секретное слово
  secret: 'yoursecretword_blahblahblah',
  resave: true,
  saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

// добавим passport к server routes
require('./api')(app, passport)

// react-router routes
const routes = require('./src/routes')

app.get('*', (req, res) => {
  const isAuth = req.isAuthenticated()
  const r = routes(() => isAuth)
  match({ routes: r, location: req.url }, (error, redirectLocation, renderProps) => {
    if(error) {
      res.status(500).send(error.message)
    } else if(redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if(renderProps) {
      const store = configureStore()
      const user_id = req.user ? req.user._id : null
      const cookie = req.headers.cookie
      
      if(isAuth) {
        store.dispatch({ 
          type: "LOGIN_SUCCESS", 
          response: { username: req.user.username, id: user_id }
        })
      } 

      fetchAll(store, renderProps, user_id, cookie).then(() => {
        render(res, store, renderProps)
      }).catch(error => {
        return res.render("index", {
          content: "Something went wrong!",
          initialState: "{}"
        })
        res.status(500).send("Something went wrong!");
      })
    } else {
      res.status(404).send('Not found')
    }
  })
})

function fetchAll(store, routerState, userId, cookie) {
  const promiseList = routerState.components.map(componentClass => {
    if(componentClass.fetchData) {
      return componentClass.fetchData(
        store.dispatch,
        routerState.params,
        userId,
        cookie
      )
    }
  })
  
  return Promise.all(promiseList)
}

function render(res, store, renderProps) {
  const finalState = JSON.stringify(store.getState())
  
  res.render('index', {
    content: renderToString(
      <Provider store={store}>
        <RouterContext {...renderProps} />
      </Provider>
    ),
    initialState: finalState
  })
}

app.listen(3000, 'localhost', (err) => {
  if(err) 
    return console.log(err)
  
  console.log('Listening at http://localhost:3000')
})