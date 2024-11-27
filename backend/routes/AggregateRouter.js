const express = require("express");
const ensureAuthenticated = require("../middlewares/Auth");
const router = express.Router();
const {aggregateExpenses} = require("../controllers/aggregateController.js");

router.get('/groupsum', ensureAuthenticated, aggregateExpenses);



module.exports = router;
