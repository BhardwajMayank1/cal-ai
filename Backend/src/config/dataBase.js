const mongoose = require('mongoose')
const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connect DB')
        
    } catch (error) {
        console.log('failed to connect')
        
    }
}
module.exports = connectDB