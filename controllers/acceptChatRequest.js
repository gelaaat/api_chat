import Chat from '../models/Chat.js'
import User from '../models/User.js'
import { dateFormatter } from '../utils/dateFormatter.js'

export const acceptRequestChat = async (req, res, next) => {
  // const { _id: userId } = req.user
  const userId = '64e648169e3e4d89f35f780f'
  const { chatName } = req.body

  try {
    const chat = await User.findOne({ username: chatName })
    const user = await User.findById(userId)

    console.log('entro a crear el chat')
    console.log(chat)
    console.log(user)

    if (!chat) { return res.status(404).json({ message: 'chat not found' }) } else if (!user.pendingRequestChats.includes(chat._id)) {
      res.status(400).json({
        message: 'You don\'t have his request friend or you just already accepted'
      })
    } else {
      user.pendingRequestChats = user.pendingRequestChats.filter(request => {
        return !request._id.equals(chat._id)
      })

      chat.sendedRequestChats = chat.sendedRequestChats.filter(request => {
        return !request._id.equals(user._id)
      })

      const date = dateFormatter()

      const newChat = new Chat({
        dateInitial: date,
        users: [user, chat]
      })

      user.chats.push(newChat)
      chat.chats.push(newChat)

      await user.save()
      await chat.save()
      await newChat.save()

      res.status(201).json({
        message: 'chat created'
      })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Something gone wrong accepting the request' })
  }
}
