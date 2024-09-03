import mongoose from "mongoose"


function fundRaiseDbConnection(): void {

    const connectionURL = process.env.MONGO_URL as string
    mongoose.connect(connectionURL).then(() => {
        console.log("Fund raise database has been connected")
    }).catch((err) => {
        console.log(err)
        console.log("Fund raise database has been failed");
    })
}

export default fundRaiseDbConnection

// module.exports = fundRaiseDbConnection