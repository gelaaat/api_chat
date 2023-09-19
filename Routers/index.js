import express from 'express'
import passport from 'passport'
import { isAuth } from '../middlewares/isAuth.js'
import { createUser } from '../controllers/createUser.js'
import { sendChatRequest } from '../controllers/sendChatRequest.js'
import { getChatMessages } from '../controllers/getChatMessages.js'
import { acceptRequestChat } from '../controllers/acceptChatRequest.js'
import { loginSuccessfull } from '../controllers/loginSuccessfull.js'
import { setLastChats } from '../controllers/setLastChats.js'

const router = express.Router()

// Sessions
router.post('/login-local', passport.authenticate('local', { failureRedirect: '/api/failureLogin', session: true }), loginSuccessfull)

router.get('/failureLogin', (req, res, next) => {
  res.status(400).json({ message: 'Username or password are incorrect' })
})

router.delete('/logout', isAuth, (req, res, next) => { // Afegir isAuth
  req.logOut(err => {
    if (err) { return next(err) }
    console.log('user logout correcte')
    res.status(200).json({ message: 'Logout succesfull' })
  })
})

router.post('/register-local', createUser)

// Chats
router.post('/addChat', isAuth, sendChatRequest) // Afegir isAuth
router.post('/acceptChatRequest', isAuth, acceptRequestChat) // Afegir isAuth

// Messages
router.post('/setLastChat', isAuth, setLastChats) // Afegir isAuth
router.get('/getChatMessages/:chatId', isAuth, getChatMessages) // Afegir isAuth

export default router
