import User from '../models/User.js'

export const loginSuccessfull = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'lastChats',
        model: 'Chat',
        populate: {
          path: 'users',
          model: 'User'
        }
      }).populate({
        path: 'chats',
        model: 'Chat',
        populate: {
          path: 'users',
          model: 'User'
        }
      })
    console.log(user)

    console.log(user, req.user)
    res.status(200).json({
      username: user.username,
      email: user.email,
      chats: user.chats,
      pendingRequestChats: user.pendingRequestChats,
      sendedRequestChats: user.sendedRequestChats,
      image: user.image,
      lastChatsMessage: user.lastChatsMessage,
      lastChats: user.lastChats
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Something gone wrong with the login'
    })
  }
}
