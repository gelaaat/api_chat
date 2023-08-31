import { Schema, model } from 'mongoose'

const ChatSchema = new Schema({
  dateInitial: { type: String, require: true },
  users: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  messages: [{
    type: Schema.ObjectId,
    ref: 'Messages'
  }],
  lastMessage: [{
    type: Schema.ObjectId,
    ref: 'Messages'
  }]
})

export default model('Chat', ChatSchema)
