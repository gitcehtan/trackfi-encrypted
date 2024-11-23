const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const {token} = require("../controllers/authControllers.js");



const { encryptedExpenses } = require("../controllers/encryptedExpenseController");
const {CreateExpense, UpdateExpense,DeleteExpense} = require("../controllers/expenseControllers.js")
const ensureAuthenticated = require("../middlewares/Auth.js");
const ExpenseModel = require("../models/Expense.js");
const User = require("../models/User.js");

// router.get('/',ensureAuthenticated, async (req,res) => {
//     // const {_id} = req.user;
//     // const expenses = await ExpenseModel.find({userId: _id});
    
//     // const decryptedExpense = expenses.map((expense)=> (
//     //     DecryptData(expense)
//     //     // expense
        
//     // ))

//     // console.log("Decrypted data "+JSON.stringify(decryptedExpense));
    
//     // // const decryptedExpense = decryptData(expenses, globalSecretKey);

//     // res.status(200)
//     //    .json(decryptedExpense)

//     // let token = req.user.token;
//     let url = "http://localhost:3000/expenses/decrypted";
//     const headers = {
//         headers: {
//         "Authorization" : token,
//         "Content-Type": "application/json"
//         }
//       }
//     const expenses = await fetch(url, headers);

//      res.status(200)
//        .json(expenses)


// });

let globalSecretKey = null; // Define the variable

router.post('/create',ensureAuthenticated, (req,res)=>{ CreateExpense(req,res,EncryptData, globalSecretKey)});
router.post('/update',ensureAuthenticated, (req,res)=>{ UpdateExpense(req,res,EncryptData, globalSecretKey)});
router.delete('/delete',ensureAuthenticated,  DeleteExpense);

router.get('/decrypted', ensureAuthenticated, (req,res)=>{ encryptedExpenses(req,res, globalSecretKey)});

// logout

router.post('/logout', ensureAuthenticated, (req, res) => {
    globalSecretKey =  null; // Reset the globalSecretKey
    // req.logout(); // Optional: If using Passport.js for authentication
    res.status(200).json({
        message: "Logged out successfully. Secret Key has been reset.",
        success: true,
    });
});

// Secret Key Encryption

const getGlobalSecretKey = () => globalSecretKey; // Getter function

const setGlobalSecretKey = (key) => {
    globalSecretKey = key; // Setter function
};

let currUser = null;
router.post("/setsecret", ensureAuthenticated, async (req,res) => {
    const { secretKey } = req.body;
   
    
    if (!secretKey) return  res.status(400).json(
          {message:"Secret Key is Required",
          success: false
      });
      
    //   console.log("req.user  "+JSON.stringify(req.user.email));
      
    const currUserEmail = req.user.email;
    currUser = await User.findOne({email: currUserEmail});

    let isKeyCorrect = await bcrypt.compare(secretKey, currUser.secretKey);

    if(!isKeyCorrect){
        globalSecretKey=null;
        return  res.status(409).json(
            {message:"Secret Key is Invalid",
            success: false
        });
    }
    // globalSecretKey = secretKey; // Set the global secret key
    req.secretKey = globalSecretKey;
    setGlobalSecretKey(secretKey); // Update the secret key
    
    
    res.status(200)
        .json(
            {message:"Secret key set successfully",
                success: true
            });
    
    
});


// Global Encrypt Decrypt Data 





const EncryptData = async (data) => {
    try {
        if (!data || !data.description || !data.category || !data.amount) {
            throw new Error("Invalid input data. Description, category, and amount are required.");
        }

        if (!globalSecretKey) {
            throw new Error("Secret Key is required for encryption.");
        }

        const salt = currUser.salt; // User-specific salt
        const aesKey = crypto.pbkdf2Sync(globalSecretKey, salt, 100000, 32, 'sha256');
        const iv = crypto.randomBytes(16); // Generate a unique IV for encryption

        const encryptValue = (value) => {
            const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
            let encrypted = cipher.update(value, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            return encrypted;
        };

        // Encrypt fields
        return {
            description: encryptValue(data.description),
            category: encryptValue(data.category),
            amount: encryptValue(data.amount.toString()), // Convert amount to string
            iv: iv.toString('hex'), // Store IV for decryption
        };
    } catch (error) {
        console.error("Error in EncryptData:", error.message);
        return { error: error.message };
    }
};



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

        // Decrypt fields
        const decryptedData = {
            description: decryptValue(encryptedData.description),
            category: decryptValue(encryptedData.category),
            amount: decryptValue(encryptedData.amount),
        };

        console.log("Decrypted Data:", decryptedData);
        return decryptedData;
    } catch (error) {
        console.error("Error in DecryptData:", error.message);
        return { error: error.message };
    }
};



// Example usage:
// const encryptedData = { description: "...", category: "...", amount: "...", iv: "..." };
// const decryptedExpense = decryptData(encryptedData, globalSecretKey);


module.exports = {router, 
    
    getGlobalSecretKey
};
