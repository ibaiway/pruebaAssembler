import mongoose from 'mongoose'
// const MONGO_URI = 'mongodb://localhost:27017/my-database'
const MONGO_URI = process.env.MONGO_URI

function connect () {
  return mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
}

export default connect
