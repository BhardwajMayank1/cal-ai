const mongoose = require('mongoose')

const mealSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        index:true,
    },
    imageUrl:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:['processing','completed','failed'],
        default:'processing',
    },
    foodName:{
        type:String,
        
    },
    nutrition: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number,
    sugar: Number
  },
   portionEstimate: String,
  confidence: Number,
  rawAiResponse: mongoose.Schema.Types.Mixed,
  errorMessage: String
}, { timestamps: true })

mealSchema.index({ userId: 1, createdAt: -1 })


const mealModel = mongoose.model('Meal',mealSchema)
module.exports = mealModel