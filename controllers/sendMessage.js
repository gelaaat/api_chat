import Chat from '../models/Chat.js'
import Messages from '../models/Message.js'

export const sendMessage = async (req, res, next) => {
  const { message, chatId } = req.body
  const { _id: userId } = req.user

  try {
    const chat = await Chat.findById(chatId)

    const receiver = JSON.stringify(userId) === JSON.stringify(chat.users[0]) ? chat.users[1] : userId

    const newMessage = new Messages({
      message,
      date: `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
      transmitterUser: userId,
      receiverUser: receiver
    })

    await newMessage.save()

    chat.messages = chat.messages.concat(newMessage)

    await chat.save()

    res.status(201).send(chat)
  } catch (error) {
    res.status(500).json({ message: 'Something gone wrong sending the message' })
  }
}
