const express = require('express')
const mealController = require('../Controllers/meal.Controller')
const Router = express.Router()
const multer = require('multer')
 
const upload= multer({
    storage:multer.memoryStorage()
})


Router.post('/analyze',upload.single('image'),mealController.analyzeMeal)

// routes/mealRoutes.js
Router.get('/:id', mealController.getMealById);

Router.delete('/:id',mealController.delteMealById)

module.exports =Router