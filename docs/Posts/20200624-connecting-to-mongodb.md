# Connecting to MongoDB
##### June 24th, 2020 By Alex Hu

Creating the [MongoDB](https://www.mongodb.com/) is simple enough through
[MongoDB Altas](https://www.mongodb.com/cloud/atlas) in the cloud, which can
be easily access using [MongoDB Compass](https://www.mongodb.com/products/compass)
for viewing the database records.

Create the schema with [Mongoose](https://mongoosejs.com/) is also easy and the generated models
can be used for the CRUD functions.

Maintaining a stable connection to MongoDB Atlas is a bit of a challenge. I tried to make a connection
once at the top of the resolver, but once in a while, I will get this error when trying to perform
a database operation like find / save / delete:
```
MongoError: topology was destroyed
```
I ended up putting my *dbConnect()* before each resolver operation to reconnecting to the database
and retry the connection if necessary,
```js
async deleteArticle(_parent: any, args: any, _context: any, _info: any) {
    await dbConnect()
    await Article.findByIdAndDelete(args.input.id)
    return true
},
```
The dbConnect() will make a connection and retry up to 10 times if failed.
```js
// dbConnecdt.js
import mongoose from 'mongoose'

const RETRY_MAX = 10
let connected = false

async function dbConnect() {
  if (!connected) {
    let retry = 0
    console.log('dbConnect -> entering, connected = ' + connected)
    while (!connected && retry < RETRY_MAX) {
      try {
        mongoose.Promise = Promise
        await mongoose.connect(process.env.MONGO_URI as string, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: true,
        })
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
```
