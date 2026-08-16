const express = require('express')
const Router = express.Router()
const dashboard = require('../Controllers/dashboard.controller')

Router.get('/summary',dashboard.getSummary)

module.exports=Router