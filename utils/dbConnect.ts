import mongoose from 'mongoose'
// import { promisify } from 'util'
// const MONGO_URI = 'mongodb+srv://alexhu98:stardust@cluster0-uk6wq.mongodb.net/portfolio?retryWrites=true&w=majority'
// const sleep = promisify(setTimeout)

const RETRY_MAX = 3
let connected = false

async function dbConnect() {
  let retry = 0
  console.log('dbConnect -> entering, connected = ' + connected)
  while (!connected && retry < RETRY_MAX) {
    try {
      mongoose.Promise = Promise
      // const db = await mongoose.connect(MONGO_URI, {
      await mongoose.connect(process.env.MONGO_URI as string, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        socketTimeoutMS: 0,
        keepAlive: true,
        // reconnectTries: 30,
        // reconnectInterval: 500, // in ms
      })
      // const connection = db.connections[0]
      const connection = mongoose.connection
      connection.on('error', console.error.bind(console, 'dbConnect() connection error:'))
      connected = true
      break
    }
    catch (error) {
      console.error('dbConnect -> retry = ' + retry + ', error', error)
    }
  }
  console.log('dbConnect -> exiting dbConnect, connected = ' + connected + ', retry = ' + retry)
}

export default dbConnect
