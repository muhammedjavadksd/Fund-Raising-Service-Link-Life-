import express, { Express } from 'express';
import dotenv from 'dotenv'
import fileUpload from 'express-fileupload'
import morgan from 'morgan'
import fundRaiseDbConnection from './src/util/config/db/connection';
import userRouter from './src/router/userRouter/userRouter';
import adminRouter from './src/router/adminRouter/adminRouter';

dotenv.config({ path: "./.env" });
fundRaiseDbConnection()

const app: Express = express();
const PORT = process.env.PORT || 7005

app.use(express.static(__dirname + "/public"))
app.use(fileUpload({ createParentPath: true }))
app.use(morgan("dev"))

app.use("/", userRouter)
app.use("/admin", adminRouter)

app.listen(PORT, () => {
    console.log("Fund Raising started at Port : " + PORT)
})