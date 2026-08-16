const { set } = require('../app')
const goalModel = require('../Models/dailyGoals')

async function setGoals(req,res){
    try {
        const {calories , protein ,carbs , fat}= req.body
        if(!calories || !protein || !carbs || !fat){
        return res.status(400).json({
            message:"fullfill all the feilds"
        })
        }

        const isGoalExist = await goalModel.findOne({userId:req.userId})

        if(isGoalExist){
            return res.status(401).json({
                message:'only update the goals' 
            })
        }

        const goals = await goalModel.create ({
            userId:req.userId,
            calories,
            protein,
            carbs,
            fat
        })

    res.status(200).json(goals)


    } catch (error) {
        res.status(400).json({
            message:'error',message:error.message
        })
    }
}


async function getGoals(req,res) {
    try {
        const goals = await goalModel.findOne({userId:req.userId})

        if(!goals){
            return res.status(400).json({message:"please set the goals first "})
        }
        return res.status(200).json(goals)
    } catch (error) {
        return res.status(400).json({
            message:'server error'
        })
    }
}

async function updateGoals(req, res) {
    try {
        const { calories, protein, carbs, fat } = req.body

        const goals = await goalModel.findOneAndUpdate(
            { userId: req.userId },
            { $set: { calories, protein, carbs, fat } },
            { new: true, runValidators: true }
        )

        if (!goals) {
            return res.status(404).json({ message: "Set the goals first" })
        }

        res.status(200).json(goals)

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
}

module.exports={
    setGoals,
    getGoals,
    updateGoals
}