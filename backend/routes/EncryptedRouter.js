const express = require("express");
const { encryptedExpenses } = require("../controllers/encryptedExpenseController");
const ensureAuthenticated = require("../middlewares/Auth");
const router = express.Router();


router.get('/encrypted', ensureAuthenticated,encryptedExpenses);



module.exports = router;
