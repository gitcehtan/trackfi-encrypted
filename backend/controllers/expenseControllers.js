const ExpenseModel = require("../models/Expense.js")
const mongoose = require("mongoose");



const CreateExpense = async(req, res,EncryptData,globalSecretKey) => {
    
    
    
    // console.log(globalSecretKey);
    

    try {
        if(globalSecretKey === null){
            
            return res.status(400)
            .json({
             message: "Key Must be entered once to verify it's you",
             success: false
            })
        }

        const userId = req.user._id;

        
        

        const {description, category, amount } = req.body;
        
        const expense = {description, category, amount};
        console.log("Original Expense ",expense);
        
        let encryptedData = await EncryptData(expense);
        const finalEncryptedData = {...encryptedData,userId};
        console.log("Encrypted Expense ",finalEncryptedData);
        // let iv="gygygygy";
        const expenseModel = new ExpenseModel(finalEncryptedData);

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
            success: false
           })
    }
}

const UpdateExpense = async (req,res, EncryptData, globalSecretKey) => {
    try {
        const {expenseId, description, category, amount} = req.body;

        if(globalSecretKey === null){
            
            return res.status(400)
            .json({
             message: "Key Must be entered once to verify it's you",
             success: false
            })
        }

        const userId = req.user._id;

        const update = {
            description:description,
            category: category,
            amount: amount
        }

        let encryptedUpdateData = await EncryptData(update);
        // let finalEncryptedData = {...encryptedData,userId,_id:expenseId};
   

        const _id =  mongoose.Types.ObjectId.createFromHexString(expenseId);
        const options = {
            new: true
        };

       const updatedExpense =  await ExpenseModel.findByIdAndUpdate(_id, encryptedUpdateData, options);
        
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