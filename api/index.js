import mongoose from 'mongoose'
import Books from '../src/models/Books'

module.exports = function(app, passport) {
  // auth middleware
  function isAuth(req, res, next) {
    if(!req.isAuthenticated()) 
      return res.status(401).end()

    next()
  }


  // AUTH -----------------------------------------------------------
  app.get('/api/auth', (req, res) => {
    if(!req.isAuthenticated())
      return res.status(401).end()

    res.json(req.user)
  })


  app.get('/api/auth/twitter', passport.authenticate('twitter'))
  app.get('/api/auth/twitter/callback', 
    passport.authenticate('twitter', { failureRedirect: '/' }),
    (req, res) => res.redirect('/')
  )


  app.get('/api/auth/facebook', passport.authenticate('facebook'))
  app.get('/api/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    (req, res) => res.redirect('/')
  )


  app.get('/api/auth/vkontakte', passport.authenticate('vkontakte'))
  app.get('/api/auth/vkontakte/callback',
    passport.authenticate('vkontakte', { failureRedirect: '/' }),
    (req, res) => res.redirect('/')
  )


  app.post('/api/auth/login', (req, res, next) => {
    passport.authenticate('local-login', {failureFlash: true}, (err, user, info) => {
      if(err) 
        return next(err)
      if(!user) 
        return res.status(401).json([info.message])
  
      req.logIn(user, err => {
        if(err)
          return next(err)
        res.json({username: user.username, id: user._id})
      })
    })(req, res, next)
  })


  app.post('/api/auth/signup', (req, res, next) => {
    passport.authenticate('local-signup', {failureFlash: true}, (err, user, info) => {
      if(err)
        return next(err)
        
      if(!user)
        return res.status(401).json([info.message])
        
      req.logIn(user, err => {
        if(err)
          return next(err)
        res.json({username: user.username, id: user._id})
      })
    })(req, res, next)
  })


  app.get('/api/auth/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })



  // BOOKS ------------------------------------------
  app.get("/api/users/:userId/books", isAuth, (req, res) => {
    Books.find({ user_id: req.user._id }, (err, books) => {
      setTimeout(() => {
        res.json(books)
      }, 2000)
    })
  })

  app.post("/api/users/:userId/books", isAuth, (req, res, next) => {
    const book = {
      ...req.body,
      user_id: req.user._id,
      _id: mongoose.Types.ObjectId(),
    }

    new Books(book).save((err, r) => {
      res.json(book)
    })
  })

  app.put('/api/users/:userId/books/:bookId', isAuth, (req, res, next) => {
    Books.update(
      { user_id: req.user._id, _id: req.params.bookId },
      req.body,
      (err, result) => {
        res.end()
      }
    )
  })

  app.delete("/api/users/:userId/books/:bookId", isAuth, (req, res) => {
    const user_id = req.user._id
    Books.remove({ user_id, _id: req.params.bookId }, err => {
      res.end()
    })
  })
}