import mongoose from 'mongoose'

// import { promisify } from 'util'
// const sleep = promisify(setTimeout)

const RETRY_MAX = 10
let connected = false

async function dbConnect() {
  if (!connected) {
    let retry = 0
    console.log('dbConnect -> entering, connected = ' + connected)
    while (!connected && retry < RETRY_MAX) {
      try {
        mongoose.Promise = Promise
        // const db = await mongoose.connect(MONGO_URI, {
        await mongoose.connect(process.env.MONGO_URI as string, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: true,
        })
        // const connection = db.connections[0]
        const connection = mongoose.connection
        connection.on('error', console.error.bind(console, 'dbConnect() connection error:'))
        connected = true
        break
      }
      catch (error) {
        console.error('dbConnect -> retry = ' + retry + ', error', error)
        retry--
      }
    }
    console.log('dbConnect -> exiting dbConnect, connected = ' + connected + ', retry = ' + retry)
  }
}

export default dbConnect
