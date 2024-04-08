const express = require('express')
const cors = require('cors');
const app = express()
const connectDB = require("./db");
connectDB();

app.use(cors());
app.use(express.json())
app.use("/api/auth", require("./Auth/authRoute"))
app.use("/product",require('./Product/productRoute'))


app.listen(5000,()=>{
    console.log("server is running on 5000")
})