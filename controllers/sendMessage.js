import Chat from '../models/Chat.js'
import Messages from '../models/Message.js'
import { dateFormatter } from '../utils/dateFormatter.js'

export const sendMessage = async (req, res, next) => {
  const { message, chatId } = req.body
  // const { _id: userId } = req.user
  const userId = '64e3dfc522b9740b28572ce7'

  try {
    const chat = await Chat.findById(chatId)

    const receiver = userId === chat.users[0] ? chat.users[1] : chat.users[0]

    const date = dateFormatter()

    const newMessage = new Messages({
      message,
      date,
      transmitterUser: userId,
      receiverUser: receiver
    })

    await newMessage.save()

    chat.messages = chat.messages.concat(newMessage)

    await chat.save()

    const chatToSend = await Chat.findById(chatId).populate({
      path: 'messages',
      options: {
        // sort: { initialDate: 1 },
        populate: {
          path: 'transmitterUser',
          model: 'User'
        }

      }
    })

    res.status(201).send(chatToSend)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something gone wrong sending the message' })
  }
}
