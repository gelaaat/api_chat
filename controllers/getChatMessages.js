import Chat from '../models/Chat.js'

export const getChatMessages = async (req, res, next) => {
  const { _id: userId } = req.user
  let chatId
  let limit

  // This is for handling the requests from fetch and axios
  if (Object.keys(req.body).length > 0) {
    chatId = req.body.chatId || null
    limit = req.body.limit || 10
  } else {
    chatId = req.query.chatId || null
    limit = req.query.limit || 10
  }

  try {
    const newChat = await Chat.findOne({ users: { $all: [userId, chatId] } })
      .populate({
        path: 'messages',
        options: {
          limit,
          sort: { date: 1 }
        }
      })

    console.log(newChat)

    res.status(200).json(newChat)
  } catch (error) {
    res.status(404).json({
      message: 'Something gone wrong retrieving the user messages',
      error
    })
  }
}
