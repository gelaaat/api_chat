import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

mongoose.set('strictQuery', false)

export const db = async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'whatsapp_v2'
  }).then(() => {
    console.log('Connected to MongoDb')
  }).catch((err) => {
    console.log(err)
    console.log('Something goes wrong with MongoDb connection')
  })
}

process.on('uncaughtException', error => {
  console.error(error)
  mongoose.disconnect()
})
