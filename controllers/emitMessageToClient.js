import Chat from '../models/Chat.js'
import Message from '../models/Message.js'
import { dateFormatter } from '../utils/dateFormatter.js'

export const emitMessageToClient = async (message, username, idChat) => {
  try {
    const chat = await Chat.findById(idChat).populate({
      path: 'users',
      model: 'User',
      select: '_id username, email'
    })

    const receiver = username === chat.users[0].username ? chat.users[1] : chat.users[0]
    const transmitter = username !== chat.users[0].username ? chat.users[1] : chat.users[0]

    const date = dateFormatter()

    const newMessage = new Message({
      message,
      date,
      transmitterUser: transmitter,
      receiverUser: receiver
    })

    await newMessage.save()

    chat.messages = chat.messages.concat(newMessage)

    await chat.save()

    /* const chatToSend = await Chat.findById(chatId).populate({
      path: 'messages',
      model: Messages.modelName,
      options: {
        // sort: { initialDate: 1 },
        populate: {
          path: 'transmitterUser',
          model: 'User'
        }

      }
    }) */

    const newMessageToSend = await Message.findById(newMessage._id).populate({
      path: 'transmitterUser',
      model: 'User',
      select: '_id username email'
    })

    return JSON.stringify(newMessageToSend)
  } catch (error) {
    console.error(error)
  }
}
