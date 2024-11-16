const express = require("express");
const ensureAuthenticated = require("../middlewares/Auth");
const router = express.Router();
const {groupSum} = require("../controllers/aggregateController.js");

router.get('/groupsum', ensureAuthenticated, groupSum);



module.exports = router;
