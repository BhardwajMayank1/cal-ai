require('dotenv').config()

const app = require('./src/app')
const connectDB = require('./src/config/dataBase')

console.log('Gemini key present:', !!process.env.GEMINI_API_KEY);
console.log('Groq key present:', !!process.env.GROQ_API_KEY);
console.log('Mongo URI present:', !!process.env.MONGO_URI); // Verify Mongo key exists

// Connect to Database first, then start listening
connectDB().then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}).catch((err) => {
    console.error('Failed to start server due to DB connection error:', err.message);
})