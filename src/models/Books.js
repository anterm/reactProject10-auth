import mongoose from 'mongoose'

const Schema = mongoose.Schema

const BookSchema = new Schema({
  name: 'string',
  author: "string",
  price: "number",
  user_id:  Schema.Types.ObjectId
})

BookSchema.index({ user_id: 1, name: 1 })

export default mongoose.model('Books', BookSchema)