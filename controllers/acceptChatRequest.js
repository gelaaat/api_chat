import Chat from '../models/Chat.js'
import User from '../models/User.js'

export const acceptRequestChat = async (req, res, next) => {
  const { _id: userId } = req.user
  const { chatId } = req.body

  try {
    const chat = await User.findById(chatId)
    const user = await User.findById(userId)

    if (!chat) { return res.status(404).json({ message: 'chat not found' }) } else if (!user.pendingRequestChats.includes(chat._id)) {
      res.status(400).json({
        message: 'You don\'t have his request friend or you just already accepted'
      })
    } else {
      user.chats.push(chat)
      chat.chats.push(user)

      user.pendingRequestChats = user.pendingRequestChats.filter(request => {
        return !request._id.equals(chat._id)
      })

      chat.sendedRequestChats = chat.sendedRequestChats.filter(request => {
        return !request._id.equals(user._id)
      })

      const newChat = new Chat({
        dateInitial: `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
        users: [user, chat]
      })

      user.chats.push(newChat)
      chat.chats.push(newChat)

      await user.save()
      await chat.save()
      await newChat.save()

      res.status(201).json({
        chat: newChat._id
      })
    }
  } catch (err) {
    res.status(500).json({ message: 'Something gone wrong accepting the request' })
  }
}
