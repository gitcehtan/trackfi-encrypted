const JOI = require("joi");

const signupValidation = (req,res,next) =>{
    const schema = JOI.object({
        name: JOI.string().min(3).max(100).required(),
        email: JOI.string().email().required(),
        password: JOI.string().min(3).max(100).required()
    });

    const {error} = schema.validate(req.body);

    if(error){
        // console.log(error);
        
       return res.status(400)
           .json({
            message: "Bad Request",
            error:error
           })
    }

    next();
}

const loginValidation = (req,res,next) =>{
    const schema = JOI.object({
        email: JOI.string().email().required(),
        password: JOI.string().min(3).max(100).required()
    });

    const {error} = schema.validate(req.body);

    if(error){
       return res.status(400)
           .json({
            message: "Bad Request",
            error
           })
    }

    next();
}


module.exports ={
    loginValidation,
    signupValidation
}