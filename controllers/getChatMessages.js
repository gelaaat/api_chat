import Chat from '../models/Chat.js'

export const getChatMessages = async (req, res, next) => {
  // const { _id: userId } = req.user
  const userId = '64e3dfc522b9740b28572ce7'
  const { chatId } = req.params
  let limit

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
    const newChat = await Chat.findOne({ users: { $all: userId }, _id: chatId }) // { users: { $all: [userId] } }
      .populate({
        path: 'messages',
        options: {
          populate: {
            path: 'transmitterUser'
          },
          limit
          // sort: { initialDate: 1 }
        }
      })

    res.status(200).json(newChat)
  } catch (error) {
    console.log(error)
    res.status(404).json({
      message: 'Something gone wrong retrieving the user messages'
    })
  }
}
