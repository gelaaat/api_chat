import { Schema, model } from 'mongoose'

const MessagesSchema = new Schema({
  message: { type: String, require: true },
  date: { type: String, require: true },
  transmitterUser: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  receiverUser: {
    type: Schema.ObjectId,
    ref: 'User'
  }
})

export default model('Messages', MessagesSchema)
