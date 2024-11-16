const ExpenseModel = require("../models/Expense.js")
const mongoose = require("mongoose");

const CreateExpense = async(req, res) => {
    try {
        const userId = req.user._id;
        const {description, category, amount } = req.body;

        const expenseModel = new ExpenseModel({
            description,
            category,
            amount,
            userId
        });

        await expenseModel.save();

        res.status(200)
           .json({
            message: "Expense Created Successfully",
            success: true
           })

    } catch (error) {
        res.status(500)
           .json({
            message: "Internal Server Error",
            success: true
           })
    }
}

const UpdateExpense = async (req,res) => {
    try {
        const {expenseId, description, category, amount} = req.body;

        const update = {
            description:description,
            category: category,
            amount: amount
        }
        const _id =  mongoose.Types.ObjectId.createFromHexString(expenseId);
        const options = {
            new: true
        };

       const updatedExpense =  await ExpenseModel.findByIdAndUpdate(_id, update, options);
        
       res.status(200)
          .json({message: `Description : ${updatedExpense.description} ,
           Category : ${updatedExpense.category},
           Amount : ${updatedExpense.amount}
                            Updated Successfully`,
                        success: true});


    } catch (error) {
        res.status(500)
          .json({message:"Internal Server Error"});
    }
}

const DeleteExpense = async (req,res) => {
    try {
        const {expenseId} = req.body;

       console.log(expenseId);
       
        const _id =  mongoose.Types.ObjectId.createFromHexString(expenseId);
       

       const response =  await ExpenseModel.deleteOne({_id:_id});
        
       if(response){
            res.status(200)
               .json({
                message: "Deleted Successfully",
                success: true
               })
       }


    } catch (error) {
        res.status(500)
          .json(
            {message:"Internal Server Error",
            success: false
        });
    }
}


module.exports = {
    CreateExpense,
    UpdateExpense,
    DeleteExpense
}