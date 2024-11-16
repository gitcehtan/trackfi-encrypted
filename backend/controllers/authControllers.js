const UserModel = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const signup = async (req,res) => {
    try {
        const {name, email, password} = req.body;
        
        const user = await UserModel.findOne({email: email});

        if(user){
            return res.status(409)
                      .json({
                        message:"User Already Exists Please Login",
                        success: false
                      })
        }

        const userModel = new UserModel({name, email, password});

        userModel.password = await bcrypt.hash(password, 10);

        await userModel.save();

        res.status(201)
           .json({
            message:"User Registered Successfully",
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

const login = async (req,res) => {

    try {
        const {email, password} = req.body;

        const user = await UserModel.findOne({email: email});
        let errMsg = "User Doesn't Exists Please SignUp"
        if(!user){
            return res.status(403)
                      .json({
                        message:errMsg,
                        success: false
                      })
        }
        
        let isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect){
            return res.status(403)
                      .json({
                      message:errMsg,
                      success: false
                     })
        } 

        const jwtToken = jwt.sign(
            {email: user.email, _id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: "24h"}
            );
        
        

        res.status(200)
           .json({
            message: "Logged In Successfully",
            success: true,
            jwtToken,
            email,
            _id: user._id,
            name: user.name
        })


    } catch (error) {
        res.status(500)
           .json({
            message: "Internal Server Error",
            success: false
           })
    }
}


module.exports = {
    login, 
    signup
};

