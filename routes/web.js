const express = require('express')
const FrontController = require('../controllers/Guest/FrontController')
const router = express.Router()


// FrontController
router.get('/',FrontController.login)
router.post('/login-verify',FrontController.loginVerify)
router.get('/register',FrontController.register)
router.post('/register-user',FrontController.registerUser)





module.exports = router