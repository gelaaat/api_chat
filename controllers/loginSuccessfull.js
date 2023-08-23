import User from '../models/User.js'

export const loginSuccessfull = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('chats', { hash: 0 })
      .populate('pendingRequestChats', { hash: 0 })
      .populate('sendedRequestChats', { hash: 0 })
      .populate('lastChatsMessages')
      .populate('lastChats')

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
    console.log(res)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Something gone wrong with the login'
    })
  }
}
