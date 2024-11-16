require("dotenv").config();
const jwt = require("jsonwebtoken");

const ensureAuthenticated = (req,res,next) => {

    
    const token = req.headers["authorization"]

    if(!token){
        res.status(403)
            .json({
            message: "Unauthorized User, Login required"
            })
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        req.user = decoded;

        next();

    } catch (error) {
        res.status(403)
               .json({
                message: "Unauthorized User, Login required"
               })
    }

}

module.exports = ensureAuthenticated;