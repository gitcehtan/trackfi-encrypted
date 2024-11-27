const axios = require("axios")
const ExpenseModel = require("../models//Expense.js");
const mongoose = require("mongoose");


// Simulating the API call to fetch decrypted expenses
const fetchDecryptedExpenses = async () => {
    try {
        const response = await axios.get("http://localhost:3000/expenses/decrypted"); 
        // Replace with your API URL
        return response.data;
    } catch (error) {
       console.log(error);
       
    }
};

// Aggregating the data
const aggregateExpenses = async (req,res) => {
    const expenses = await fetchDecryptedExpenses();

    const groupedExpenses = expenses.reduce((acc, expense) => {
        const category = expense.category;
        const amount = parseFloat(expense.amount); // Convert amount from string to number

        if (!acc[category]) {
            acc[category] = 0; // Initialize category if not already present
        }

        acc[category] += amount; // Add the amount to the corresponding category

        return acc;
    }, {});

    // Converting the result to the desired format
    const result = Object.entries(groupedExpenses).map(([category, total]) => ({
        category,
        total
    }));

    console.log(result);
    
    res.status(200).json(result);
    // return result;
};

// Call the function
// aggregateExpenses().then((result) => console.log(result));



// const groupSum = async (req,res) =>{
//     try {
//     const userId = req.user._id;
//     console.log("USerId ",userId);
//     const _userid = mongoose.Types.ObjectId.createFromHexString(userId);
    
//     const result = await ExpenseModel.aggregate([
//         { $match: { userId: _userid } },// Match documents with the specific user ID
//         { $group: { _id: "$category", count: { $sum: "$amount" } } } // Group by category and sum the amounts
//     ]);

//     // const expense = await axios.get("http://localhost:3000/expenses/decrypted");
 

//     // console.log("aggregateController "+JSON.stringify(expense));
    

//     res.status(201)
//        .json(result);
    
//     } catch (error) {
//         res.status(500)
//            .json({message: "Internal Server Error",
//             success: false
//            })
//     }
// }

module.exports = {aggregateExpenses};