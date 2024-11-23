const ExpenseModel = require("../models/Expense.js")
const mongoose = require("mongoose");
const User = require("../models/User.js");
const crypto = require("crypto");



let currUser = null;


let globalSecretKey = null;



// Simulate decryption with async
const resolvePromises = async (ciphertext) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(JSON.parse(ciphertext)); // Example decrypted data
        }, 100); // Simulate async delay
    });
};

const encryptedExpenses = async (req,res,SecretKey) => {
    globalSecretKey = SecretKey;
    try {
        const {_id} = req.user;
    const currUserEmail = req.user.email;
    currUser = await User.findOne({email: currUserEmail});
    
    const expenses = await ExpenseModel.find({userId: _id});
    
    const decryptedExpenses = expenses.map((expense)=> (
        DecryptData(expense)
        // expense
        
    ))
    const resolvedData = await Promise.all(decryptedExpenses);

    // console.log("Decrypted Data: ", resolvedData);

    res.status(200).json(resolvedData);
} catch (error) {
        res.status(500).json({
            message:"Internal Server Error",
            success:false
        });
        
    }
}

const DecryptData = async (encryptedData) => {
    try {
        // Validate input
        if (!encryptedData || !encryptedData.description || !encryptedData.category || !encryptedData.amount || !encryptedData.iv) {
            throw new Error("Invalid encrypted data. Fields description, category, amount, and iv are required.");
        }

        if (!globalSecretKey) {
            throw new Error("Secret Key is required for decryption.");
        }

        const salt = currUser.salt; // Retrieve user-specific salt
        const aesKey = crypto.pbkdf2Sync(globalSecretKey, salt, 100000, 32, 'sha256');
        const iv = Buffer.from(encryptedData.iv, 'hex'); // Convert IV to Buffer

        const decryptValue = (encryptedField) => {
            const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, iv);
            let decrypted = decipher.update(encryptedField, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        };
/*
createdAt
2024-11-23T18:23:46.748+00:00
updatedAt
2024-11-23T18:23:46.748+00:00*/


        // Decrypt fields
        const decryptedData = {
            description: decryptValue(encryptedData.description),
            category: decryptValue(encryptedData.category),
            amount: decryptValue(encryptedData.amount),
            _id: encryptedData._id,
            createdAt: encryptedData.createdAt,
            updatedAt: encryptedData.updatedAt
        };

        // console.log("Decrypted Data: ", decryptedData);
        return decryptedData;
    } catch (error) {
        console.error("Error in DecryptData:", error.message);
        return { error: error.message };
    }
};

module.exports = {encryptedExpenses};