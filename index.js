import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import passport from 'passport'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import router from './Routers/index.js'
import './passport/index.js'
import { db } from './db/index.js'
import cookieParser from 'cookie-parser'
import { Server } from 'socket.io'
import http from 'http'
import { emitMessageToClient } from './controllers/emitMessageToClient.js'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'https://fts9l2zd-5173.uks1.devtunnels.ms', // 'http://127.0.0.1:5173',
    credentials: true
  }
})
dotenv.config()
db()

// Configuracions
// const whitelist = ['http://localhost:5173']
/* const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}
const whitelist = ['http://localhost:5173']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
} */

// TODO: Canviar el cross-origin algo
app.use(cors({
  origin: 'https://fts9l2zd-5173.uks1.devtunnels.ms', // 'http://127.0.0.1:5173',
  credentials: true
}))

app.use(helmet())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser(process.env.SECRET_SESSION))

// Sessions
const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI,
  dbName: 'whatsapp_v2',
  collectionName: 'sessions'
})

app.use(session({
  name: 'cookieId',
  secret: process.env.SECRET_SESSION,
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: true, // Es posa a true quan estiguem en produccio o en https
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    sameSite: 'none'
  },
  store: sessionStore
}))

app.use(passport.initialize())
app.use(passport.session())

// Configuració del socket.io

io.engine.use((req, res, next) => { // Afegir els middlewares necessaris com isAuth
  // console.log('entro en el use del io engine')
  // console.log('-----')
  next()
})

io.on('connection', (socket) => {
  let conversationRoom

  console.log('user connected on sokcet')

  socket.on('api/sendMessage', async (...message) => { // Array [message, idChat]
    try {
      const missatge = message[0]
      const username = message[1]
      conversationRoom = message[2]

      console.log(missatge, conversationRoom)

      socket.join(`${conversationRoom}`)

      // TODO: Enviar només el nou missatge
      const data = await emitMessageToClient(missatge, username, conversationRoom)
      console.log(data)
      io.to(`${conversationRoom}`).emit('packetFromServer', data)
    } catch (error) {
      console.log(error)
    }
  })
  socket.on('disconnect', () => {
    console.log('user disconnected from socket')
    socket.leave(conversationRoom)
  })
})

app.use((req, res, next) => {
  next()
})

// Routers
app.use('/api', router)

app.use((err, req, res, next) => {
  console.log(err)
})

// Aqui aniria el 404 i el error handling

server.listen(process.env.PORT, () => {
  console.log('Server running on: ', process.env.PORT)
})
