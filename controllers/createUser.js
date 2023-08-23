import User from '../models/User.js'
import bcrypt from 'bcrypt'

export const createUser = async (req, res, next) => {
  const { username, email, password } = req.body
  console.log('createuser')
  // Falta validacions dels camps
  const salt = 10
  const hash = await bcrypt.hash(password, salt)

  try {
    const existsUser = await User.find({ username })

    if (existsUser.length !== 0) {
      res.status(400).json({
        message: 'This username already exists'
      })
      return
    }

    const newUser = new User({
      username,
      email,
      hash
    })

    await newUser.save()

    res.status(201).json('User created successfully')
  } catch (error) {
    next(new Error('Something gone wrong creating the new user'))
  }
}
