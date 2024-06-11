const InitFundRaisingModel = require("../config/db/model/initFundRaiseModel")
const util = require("util")
const path = require("path");
const { all } = require("../../router/userRouter/userRouter");

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
    },


    fundRaiserUpdate: (data, edit_id) => {
        return new Promise(async (resolve, reject) => {

            let newImages = [];
            let newDocument = []

            //get images
            if (data.images) {
                //image type  ['Document','Images'];

                let imageName;
                let imagesType = data.images?.type;
                let allImages = data.images?.data;

                if (imagesType) {
                    return reject("Images type not found")
                }

                if (!allImages) {
                    return reject("Images not found")
                }


                for (let index = 0; index < allImages; index++) {

                    let item = allImages[i]
                    let pathName = path.join(__dirname, "public/")

                    if (imagesType == "Document") {
                        imageName = "fund_raiser_image-document" + item.name
                        pathName = path.join(pathName, `fund_raise_document/${imageName}`)
                        newDocument.push(imageName)
                        //Upload document image 
                    } else {
                        //Upload normal images
                        imageName = "fund_raiser_image-image" + item.name
                        pathName = path.join(pathName, `fund_raiser_image/${imageName}`)
                        newImages.push(imageName)
                    }

                    fileHelper.saveRequestImages(item, pathName);
                }


            }

            if (newImages.length) {
                data.picture = newImages
            }

            if (newDocument.length) {
                data.documents = newDocument
            }


            let updateFundRaise = await InitFundRaisingModel.updateOne({
                fund_id: edit_id
            }, data)
            resolve("Fund raise updated success")
        })
    }

}

module.exports = fundRaisingHelper;