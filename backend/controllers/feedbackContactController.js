require("dotenv").config();
const nodemailer = require("nodemailer");


let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_MAIL, // generated ethereal user
      pass: process.env.SMTP_PASSWORD, // generated ethereal password
    },
  });
  

const feedbackContact = async(req,res) => {
   
    try {
        const {messages,email} = req.body;
        
   

       
        const htmlMessage = `
        <h2>Message Sent by User</h2>
        <br/>
        Message: ${messages}
        <br/>
        Email: ${email}
        `
       
         var mailOptions = {
           from: process.env.SMTP_MAIL,
           to: process.env.TO_MAIL,
           subject: "TRACKFI Feedback Mails ",
           html: htmlMessage,
         };
       
         transporter.sendMail(mailOptions, function (error, info) {
           if (error) {
             
             res.status(400).json({
              message:error,
              success:false
             });
           } else {
               res.status(200).json({
                message:"Feedback sent successfully!",
                success:true
               });
           
           }
         });
        
        } catch (error) {
        res.status(500).json({
            message:"Internal Server Error",
            success:false
        })
    }

   
    
}


module.exports = {feedbackContact};