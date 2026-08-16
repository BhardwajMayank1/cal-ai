const express = require('express')
const authController = require('../Controllers/auth.controller')
const Router = express.Router()
const multer = require('multer')
const {authUser}= require('../Middleware/authMiddleware')
 
const upload= multer({
    storage:multer.memoryStorage()
})


Router.post('/register', upload.single('avatar'),authController.registerUser)
Router.post('/login',authController.loginUser)
Router.post('/logout',authController.logout)
Router.get('/get',authUser,authController.getMe)

module.exports = Router