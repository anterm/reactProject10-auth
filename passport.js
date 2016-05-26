import User from './src/models/Users'
import config from './config/constants'

const LocalStrategy     = require('passport-local').Strategy
const VKontakteStrategy = require('passport-vkontakte').Strategy
const TwitterStrategy   = require('passport-twitter').Strategy
const FacebookStrategy  = require('passport-facebook').Strategy

function findOrCreateUser(provider, profile, done) {
  User.findOne(
    {provider, providerId: profile.id }, 
    (err, user) => {
      if(err) return done(err)
      if(user) return done(err, user)

      var user = new User({
        username: profile.displayName,
        provider,
        providerId: profile.id
      });

      user.save(err => {
        if(err) console.log(err)
        return done(err, user)
      });
    }
  )
}

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })


  passport.use(new FacebookStrategy({
      clientID: 1725105777773668,
      clientSecret: "606b261d71612d886af7ad79059fc6b5",
      callbackURL: config.site_url + "/api/auth/facebook/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      findOrCreateUser('facebook', profile, done)
    }
  ))


  passport.use(new TwitterStrategy({
      consumerKey: "tt1nMDkUI76ivJXehGr6ozTPI",
      consumerSecret: "aKpXN45zne03bxOApGkscCpg1500zYv0AseA5AZh5mg6ugrnE7",
      callbackURL: config.site_url + "/api/auth/twitter/callback"
    },
    (token, tokenSecret, profile, done) => {
      findOrCreateUser('twitter', profile, done)
    }
  ))


  passport.use(new VKontakteStrategy({
      clientID:     5412566,
      clientSecret: "6gRmZ67GpKsHu88Wod4M",
      callbackURL:  config.site_url + "/api/auth/vkontakte/callback",
      profileFields: ['email', 'city']
    },
    (accessToken, refreshToken, profile, done) => {
      findOrCreateUser('vkontakte', profile, done)
    }
  ))


  passport.use('local-signup', new LocalStrategy({
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    (req, username, password, done) => {
      console.log("hello")
      process.nextTick(function() {
        User.findOne({ provider: 'local', username }, (err, user) => {
          if(err) 
            return done(err)

          if(user)
            return done(null, false,  { message: "Имя уже занято!" })

          var newUser = new User()
          newUser.username = username;
          newUser.password = newUser.generateHash(password)
          newUser.provider = "local"
          newUser.save(err => {
            if(err)
              throw err
            return done(null, newUser)
          })
        })
      })
    }
  ))


  passport.use('local-login', new LocalStrategy({
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    (req, username, password, done) => {
      User.findOne({ username, provider: 'local' }, (err, user) => {
        if(err)
          return done(err)

        if(!user)
          return done(null, false, { message: "Пользователя с таким именем нет!" })

        if(!user.validPassword(password))
          return done(null, false, { message: "Неверный пароль!" })

        return done(null, user)
      })
    }
  ))
}