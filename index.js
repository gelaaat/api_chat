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

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://127.0.0.1:5173',
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

app.use(cors({
  origin: 'http://127.0.0.1:5173',
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
  secret: process.env.SECRET_SESSION,
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: false, // Es posa a true quan estiguem en produccio
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    path: '/api',
    sameSite: 'lax'
  },
  store: sessionStore
}))

app.use(passport.initialize())
app.use(passport.session())

// Configuració del socket.io

io.engine.on('connection', (socket) => {
  console.log('user connected on sokcet')

  socket.on('disconnect', () => {
    console.log('user disconnected from socket')
  })
})
/*
app.use((req, res, next) => {
  console.log('entro al use de app')
  console.log(req.rawHeaders)
  console.log(req.headers)
  next()
})

io.engine.use((error, req, res, next) => {
  console.log('entro en el use del io engine')
  console.log('------------------------------------------------------------- \n\n')
})

app.use((req, res, next) => {
  console.log('Despres del io engine')
  next()
}) */

// Routers
app.use('/api', router)

app.use((err, req, res, next) => {
  console.log(err)
})

// Aqui aniria el 404 i el error handling

server.listen(process.env.PORT, () => {
  console.log('Server running on: ', process.env.PORT)
})
