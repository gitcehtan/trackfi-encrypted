const express = require("express");
const router = express.Router();
const {signupValidation, loginValidation}  = require("../middlewares/AuthValidation.js");
const { login, signup } = require("../controllers/authControllers.js");

router.post('/login', loginValidation, login);
router.post('/signup',signupValidation,  signup);


module.exports = router;
