import express from 'express'
import passport from 'passport'
import { isAuth } from '../middlewares/isAuth.js'
import { createUser } from '../controllers/createUser.js'
import { sendChatRequest } from '../controllers/sendChatRequest.js'
import { getChatMessages } from '../controllers/getChatMessages.js'
import { sendMessage } from '../controllers/sendMessage.js'
import { acceptRequestChat } from '../controllers/acceptChatRequest.js'
import { loginSuccessfull } from '../controllers/loginSuccessfull.js'

const router = express.Router()

// Sessions
router.post('/login-local', passport.authenticate('local', { failureRedirect: '/api/failureLogin', session: true }), loginSuccessfull)

router.get('/failureLogin', (req, res, next) => {
  res.status(400).json({ message: 'Username or password are incorrect' })
})

router.delete('/logout', isAuth, (req, res, next) => {
  req.logOut(err => {
    if (err) { return next(err) }
    console.log('user logout correcte')
    res.status(200).json({ message: 'Logout succesfull' })
  })
})

router.post('/register-local', createUser)

// Chats
router.post('/addChat', isAuth, sendChatRequest)
router.post('/acceptChatRequest', isAuth, acceptRequestChat)

// Messages
router.post('/sendMessage', isAuth, sendMessage)
router.get('/getChatMessages', isAuth, getChatMessages)

export default router
