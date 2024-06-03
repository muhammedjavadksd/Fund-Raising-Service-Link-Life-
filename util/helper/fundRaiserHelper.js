const InitFundRaisingModel = require("../config/db/model/initFundRaiseModel")
const util = require("util")

let fundRaisingHelper = {

    insertInitialData: async (initialData) => {

        try {

            let insertData = await InitFundRaisingModel(initialData).save();
            console.log(insertData);
            return {
                statusCode: 200,
                status: true,
                msg: "Initial data created success",
            }
        } catch (e) {
            console.log(e);
            return {
                statusCode: 500,
                status: false,
                msg: "Something went wrong",
            }
        }
    },

    saveFundRaiserImage: async (images, fundRaiserID, isDocument) => {
        try {
            let imageName = image.name;
            let field = isDocument ? "documents" : "picture"
            let path = isDocument ? `/images/fund_raise_document/${imageName}` : `/images/fund_raiser_image/${imageName}`;
            await InitFundRaisingModel.updateOne({
                _id: fundRaiserID
            }, {
                $push: {
                    field: imageName
                }
            });

            let promisify = util.promisify(images.mv);
            await promisify(path)

            return {
                statusCode: 200,
                status: true,
                msg: "Image upload success"
            }
        } catch (e) {
            console.log(e);
            return {
                statusCode: 500,
                status: false,
                msg: "Internal Server Error"
            }
        }
    }

}

module.exports = fundRaisingHelper;