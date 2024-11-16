const express = require("express");
const router = express.Router();
     

const ensureAuthenticated = require("../middlewares/Auth.js");
const { feedbackContact } = require("../controllers/feedbackContactController.js");

router.post('/feedback', ensureAuthenticated, feedbackContact);



module.exports = router;
