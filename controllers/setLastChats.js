import { populate } from 'dotenv'
import Chat from '../models/Chat.js'
import User from '../models/User.js'

export const setLastChats = async (req, res, next) => {
  try {
    // const { _id: userId } = req.user
    const { lastChatId } = req.body
    const userId = '64e3dfc522b9740b28572ce7'

    const user = await User.findById(userId)
    const chat = await Chat.findById(lastChatId)

    if (!chat) {
      res.status(400).send({
        message: 'This chat not exists'
      })
    } else if (!user.lastChats.includes(chat._id)) {
      console.log('nomes entro quan no esta a last chat')
      user.lastChats.push(chat)

      await user.save()

      const newUser = await User.findById(userId).populate({
        path: 'lastChats',
        model: 'Chat'
      })

      res.status(201).json(newUser.lastChats)
    } else {
      user.lastChats = user.lastChats.filter(chatId => {
        return !chatId.equals(chat._id)
      })

      user.lastChats.unshift(chat._id)
      await user.save()

      const dataToSend = await User.findById(userId).populate({
        path: 'lastChats',
        model: 'Chat',
        select: '_id dateInitial users',
        populate: {
          path: 'users',
          model: 'User'
        }
      })

      console.log(dataToSend)

      res.status(201).json(dataToSend.lastChats)
    }
  } catch (error) {
    console.log(error)
  }
}
