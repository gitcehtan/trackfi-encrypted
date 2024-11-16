const mongoose = require("mongoose");

const ExpenseModel = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "user"
    },
    description:{
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
    
}, {timestamps: true});

const Expense = mongoose.model("expense", ExpenseModel);

module.exports = Expense;
