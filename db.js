import mongoose from 'mongoose'

//define the MongoDB connection URI
const MONGODB_URI = 'mongodb://localhost:27017/mydatabase'

//setup mongoose connection
mongoose.connect(MONGODB_URI)

//get the default connection
//handle connection events
const db = mongoose.connection;

//define connection events
db.on('connected', () => {
    console.log('Connected to MongoDB');
})

db.on('disconnected', () => {
    console.log('Disconnected from MongoDB');
})

db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
})

//export database connection

export default db;



