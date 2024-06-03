const { default: mongoose } = require("mongoose")

function fundRaiseDbConnection() {
    console.log(process.env.MONGO_URL)
    mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }).then(() => {
        console.log("Fund raise database has been connected")
    }).catch((err) => {
        console.log(err)
        console.log("Fund raise database has been failed");
    })
}

module.exports = fundRaiseDbConnection