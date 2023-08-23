import { Schema, model } from 'mongoose'

const UserSchema = new Schema({
  username: { type: String, require: true },
  email: { type: String, require: true },
  hash: { type: String, require: true },
  image: { type: String },
  chats: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  pendingRequestChats: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  sendedRequestChats: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  lastChats: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  lastChatsMessages: [{
    type: Schema.ObjectId,
    ref: 'Messages'
  }]
})

export default model('User', UserSchema)
