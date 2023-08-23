import passport from 'passport'
import Local from 'passport-local'
import User from '../models/User.js'

import verifyPassportLocal from './passport_local.js'

passport.use(new Local.Strategy(verifyPassportLocal))

passport.serializeUser((user, done) => {
  console.log('entro al serialize')
  done(null, user.id)
})

passport.deserializeUser((userId, done) => {
  console.log('entro al deserialize')

  User.findById(userId).then(user => {
    done(null, user)
  })
    .catch(err => {
      done(err)
    })
})
