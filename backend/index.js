const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const  AuthRouter = require("./routes/AuthRouter.js");
const  ExpenseRouter = require("./routes/ExpenseRouter.js");  
const  AggregateRouter = require("./routes/AggregateRouter.js");  
const ContactRouter = require("./routes/ContactRouter.js");
require("./models/db.js");

app.use(express.json());

const corsOptions = {
    // Allow only requests from this domain
    origin: 'http://localhost:5173',
};

app.use(cors(corsOptions));


let PORT = process.env.PORT || 3000;

app.use('/auth',AuthRouter);
app.use('/expenses',ExpenseRouter);
app.use('/aggregate', AggregateRouter)
app.use('/contact',ContactRouter)

app.listen(PORT, ()=>{
    console.log(`Server Up on http://localhost:3000`);
});
