import User from '../models/User.js'

export const sendChatRequest = async (req, res, next) => {
  const { _id: userId } = req.user
  const { username } = req.body

  try {
    const chat = await User.findOne({ username })
    const user = await User.findById(userId)
    console.log(chat)

    if (!chat) {
      return res.status(404).json({ message: 'This chat or user not exists' })
    } else if (chat.pendingRequestChats.includes(userId)) {
      console.log('Request already sended')
      res.status(208).json({ message: 'Request already sended' })
    } else {
      chat.pendingRequestChats.push(userId)
      user.sendedRequestChats.push(chat._id)

      await user.save()
      await chat.save()

      res.status(201).json({ message: 'Request sended successfully' })
    }
  } catch (error) {
    console.log(error)
    next(new Error('Something gone wrong sending de friend request'))
  }
}
