import express, { Express } from 'express';
import dotenv from 'dotenv'
import fileUpload from 'express-fileupload'
import morgan from 'morgan'
import fundRaiseDbConnection from './src/db/mongo_connection';
import userRouter from './src/router/userRouter';
import adminRouter from './src/router/adminRouter';

dotenv.config({ path: "./.env" });
fundRaiseDbConnection()

const app: Express = express();
const PORT = process.env.PORT || 7005

app.use(express.json({}))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + "/public"))
app.use(fileUpload({ createParentPath: true }))
app.use(morgan("dev"))

app.use("/", userRouter)
app.use("/admin", adminRouter)

app.listen(PORT, () => {
    console.log("Fund Raising started at Port : " + PORT)
})
