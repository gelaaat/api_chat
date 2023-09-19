import Chat from '../models/Chat.js'
import Message from '../models/Message.js'
export const getChatMessages = async (req, res, next) => {
  // const { _id: userId } = req.user
  const userId = '64e3dfc522b9740b28572ce7'
  const { chatId } = req.params
  const limit = 100

  /*
  // This is for handling the requests from fetch and axios
  if (Object.keys(req.body).length > 0) {
    chatId = req.body.chatId || null
    limit = req.body.limit || 10
  } else {
    chatId = req.query.chatId || null
    limit = req.query.limit || 10
  } */

  try {
    // Verifiquem que l'usuari estigui en el chat també
    const chatToSend = await Chat.findOne({ users: { $all: userId }, _id: chatId }) // { users: { $all: [userId] } }
      .populate({
        path: 'messages',
        model: Message.modelName,
        options: {
          populate: {
            path: 'transmitterUser',
            model: 'User'
          }
          // sort: { initialDate: 1 }
        }
      })

    res.status(200).json(chatToSend)
  } catch (error) {
    console.log(error)
    res.status(404).json({
      message: 'Something gone wrong retrieving the user messages'
    })
  }
}
