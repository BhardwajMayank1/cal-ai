require('dotenv').config()

console.log('Gemini key present:', !!process.env.GEMINI_API_KEY);
console.log('Groq key present:', !!process.env.GROQ_API_KEY);
const app = require('./src/app')
const connectDB = require('./src/config/dataBase')

connectDB()

app.listen(3000,()=>{
    console.log('server is running on port 3000'
        )
})
