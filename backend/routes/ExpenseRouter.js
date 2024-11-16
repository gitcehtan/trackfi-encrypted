const express = require("express");
const router = express.Router();

const {CreateExpense, UpdateExpense,DeleteExpense} = require("../controllers/expenseControllers.js")
const ensureAuthenticated = require("../middlewares/Auth.js");
const ExpenseModel = require("../models/Expense.js");

router.get('/',ensureAuthenticated, async (req,res) => {
    const {_id} = req.user;
    const expenses = await ExpenseModel.find({userId: _id});

    res.status(200)
       .json(expenses)
});

router.post('/create',ensureAuthenticated, CreateExpense);
router.post('/update',ensureAuthenticated,  UpdateExpense);
router.delete('/delete',ensureAuthenticated,  DeleteExpense);


module.exports = router;
