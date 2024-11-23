const mongoose = require("mongoose");

const ExpenseModel = new mongoose.Schema({
    description:{
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    iv: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "user"
    }
    
}, {timestamps: true});

const Expense = mongoose.model("expense", ExpenseModel);

module.exports = Expense;
