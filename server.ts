import express, { Express } from 'express';
import dotenv from 'dotenv'
import fileUpload from 'express-fileupload'
import morgan from 'morgan'
import fundRaiseDbConnection from './src/db/mongo_connection';
import userRouter from './src/router/userRouter';
import adminRouter from './src/router/adminRouter';
import path from 'path'

dotenv.config({ path: "./.env" });
fundRaiseDbConnection()

const app: Express = express();
const PORT = process.env.PORT || 7005

app.use(express.json({}))
app.use(express.urlencoded({ extended: true }))
// console.log("Path : ", path.join(__dirname, "public"));

app.use(fileUpload({ createParentPath: true }))
app.use(morgan("dev"))

// import fs from 'fs';

// const imagePath = path.join(__dirname, 'public/images/fund_raiser_image/a.jpg');
// fs.access(imagePath, fs.constants.F_OK, (err) => {
//     console.log(`${imagePath} ${err ? 'does not exist' : 'exists'}`);
// });


const staticPath = path.join(__dirname, 'public/images');
console.log(`Serving static files from: ${staticPath}`);

app.use("/image", express.static(staticPath))
app.use("/", userRouter)
app.use("/admin", adminRouter)

app.listen(PORT, () => {
    console.log("Fund Raising started at Port : " + PORT)
})
