const mongoose = require("mongoose");

const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL)
.then(()=>{
    console.log("DB Connected Successfully");
}).catch(() => {
    console.log("Connection Failed ");
})