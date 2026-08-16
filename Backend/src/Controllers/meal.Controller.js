const mealModel = require('../Models/mealModel')
const {uploadMeal}= require('../Services/ImageUpload')
const{analyzeFoodImage}=require('../service/ai.service')
async function analyzeMeal(req,res){
    try {
        const file = req.file
        if(!file){
            return res.status(400).json({message:'select the file'})
        }
        const uploadResult = await uploadMeal(file.buffer.toString('base64'))

         
       
        const meal = await mealModel.create({
            userId: req.userId,
            imageUrl: uploadResult.url,
            status: 'processing',
        });

        
        res.status(201).json(meal);

        
        try {
            const aiResult = await analyzeFoodImage(uploadResult.url);
            meal.status = 'completed';
            meal.foodName = aiResult.foodName;
            meal.portionEstimate = aiResult.portionEstimate;
            meal.confidence = aiResult.confidence;
            meal.nutrition = aiResult.nutrition;
            meal.rawAiResponse = aiResult.rawAiResponse;
            await meal.save();
        } catch (aiError) {
            console.error('AI analysis failed:', aiError);
            meal.status = 'failed';
            meal.errorMessage = aiError.message;
            await meal.save();
        }

    } catch (error) {
        console.error('analyzeMeal error:', error);
        return res.status(500).json({ message: 'Server error', error: error.message })
    }
}

async function getMealById(req, res) {
    try {
        const meal = await mealModel.findOne({ _id: req.params.id, userId: req.userId });
        if (!meal) return res.status(404).json({ message: 'Meal not found' });
        res.status(200).json(meal);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

async function delteMealById(req,res) {
    try {
        const meal = await mealModel.findOneAndDelete({
            _id:req.params.id,
            userId:req.userId
        })

        if(!meal){
           return res.status(400).json({mesaage:'meal is not found'})
        }
        res.status(200).json({
            message:"meal Not Found"
        })

    } catch (error) {
       return res.status(400).json({
            message:"serverErrorMeal"
        })
    }
    
}

module.exports = { 
    analyzeMeal ,
    getMealById ,
    delteMealById}