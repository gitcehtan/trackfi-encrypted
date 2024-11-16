
const ExpenseModel = require("../models//Expense.js");
const mongoose = require("mongoose");

const groupSum = async (req,res) =>{
    try {
    const userId = req.user._id;
    console.log("USerId ",userId);
    const _userid = mongoose.Types.ObjectId.createFromHexString(userId);
    
    const result = await ExpenseModel.aggregate([
        { $match: { userId: _userid } },// Match documents with the specific user ID
        { $group: { _id: "$category", count: { $sum: "$amount" } } } // Group by category and sum the amounts
    ])

    res.status(201)
       .json(result);
    
    } catch (error) {
        res.status(500)
           .json({message: "Internal Server Error",
            success: false
           })
    }
}

module.exports = {groupSum};