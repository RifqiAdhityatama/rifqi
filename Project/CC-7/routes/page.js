const express = require('express')
const router = express.Router()
const pageController = require('../controllers/page')

router.get('/login', pageController.login)
router.get('/admin-dashboard', pageController.adminDashboard)
router.get('/player-dashboard', pageController.playerDashboard)

module.exports = router