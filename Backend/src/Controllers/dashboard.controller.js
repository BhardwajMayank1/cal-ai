const mongoose = require('mongoose');
const mealModel = require('../Models/mealModel')

const dailyGoalModel = require('../Models/dailyGoals')



async function getSummary(req, res) {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const userIdObj = new mongoose.Types.ObjectId(req.userId);

        const [totals, goals, meals] = await Promise.all([
            mealModel.aggregate([
                { $match: { userId: userIdObj, status: 'completed', createdAt: { $gte: startOfDay, $lte: endOfDay } } },
                { $group: {
                    _id: null,
                    calories: { $sum: '$nutrition.calories' },
                    protein: { $sum: '$nutrition.protein' },
                    carbs: { $sum: '$nutrition.carbs' },
                    fat: { $sum: '$nutrition.fat' },
                    mealCount: { $sum: 1 }
                }}
            ]),
            dailyGoalModel.findOne({ userId: req.userId }),
            mealModel.find({
                userId: req.userId,
                status: 'completed',
                createdAt: { $gte: startOfDay, $lte: endOfDay }
            }).sort({ createdAt: -1 })
        ]);

        const consumed = totals[0] || { calories: 0, protein: 0, carbs: 0, fat: 0, mealCount: 0 };

        res.status(200).json({ consumed, goals, meals });
    } catch (error) {
        console.error('getSummary error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}


module.exports = {getSummary}