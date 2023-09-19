import { verifyPassword } from '../utils/verifyPassword.js'
import User from '../models/User.js'

export default function verifyPassportLocal (username, password, done) {
  User.findOne({ username }).then((user) => {
    if (!user) { return done(null, false) }
    console.log(user)
    const verified = verifyPassword(user, password)

    if (!verified) {
      return done(null, false)
    }

    console.log('usuari trobat per passport')

    return done(null, user)
  })
    .catch(err => {
      console.log('hi ha un error')
      return done(err)
    })
}
