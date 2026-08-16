const express = require('express')
const goalController = require('../Controllers/goals.controller')
const Router = express.Router()

Router.post('/setGoals',goalController.setGoals)

Router.get('/getGoals',goalController.getGoals)

Router.put('/updateGoals',goalController.updateGoals)

module.exports = Router
