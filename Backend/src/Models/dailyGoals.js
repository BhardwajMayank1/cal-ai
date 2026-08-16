const mongoose = require('mongoose')

const dailyGoalSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        unique:true,
        index:true,
    },
    calories:{
        type:Number,
        default:2000,
    },
    protein:{
        type:Number,
        default:150
    },
    carbs:{
        type:Number,
        default:200
    },
    fat:{
       type:Number,
       default:65
    }


},{timestamps:true})

const dailyGoalModel = mongoose.model('DailyGoal',dailyGoalSchema)

module.exports = dailyGoalModel

// const user = await User.create({ name, email, password: hashedPassword });
//await DailyGoal.create({ userId: user._id }); // defaults kick in