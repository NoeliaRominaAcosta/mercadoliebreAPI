// ************ Require's ************
const express = require('express');
const router = express.Router();

// ************ Controller Require ************
const {profile,processRegister,processLogin, update} = require('../controllers/usersController');


const registerValidator = require('../validations/registerValidator');
const loginValidator = require('../validations/loginValidator');

router
    .post('/register', registerValidator,processRegister)
    .post('/login',loginValidator, processLogin)
    .get('/profile', profile)
    .put('/update',update)

module.exports = router;
