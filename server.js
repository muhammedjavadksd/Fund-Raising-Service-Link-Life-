
//Imports
const express = require("express");
const app = express();
const dotenv = require("dotenv");

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

dotenv.config("./.env");

const fileUpload = require("express-fileupload");

app.use(fileUpload({ createParentPath: true }))
const logger = require("morgan");

//Config
app.use(logger("dev"))
const fundRaiseDbConnection = require("./util/config/db/connection");
fundRaiseDbConnection()
const userRouter = require("./router/userRouter/userRouter");
const adminRouter = require("./router/adminRouter/adminRouter");



app.use("/", userRouter)
app.use("/admin", adminRouter)


//const
const PORT = process.env.PORT || 7005



app.listen(PORT, () => {
    console.log("Fund Raising started at Port : " + PORT)
})