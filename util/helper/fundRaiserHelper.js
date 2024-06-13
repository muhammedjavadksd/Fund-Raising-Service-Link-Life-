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
            let imageName = images.name;
            let field = isDocument ? "documents" : "picture"
            let path = isDocument ? `public/images/fund_raise_document/${imageName}` : `public/images/fund_raiser_image/${imageName}`;
            console.log(fundRaiserID, imageName);

            let initFundRaise = await InitFundRaisingModel.findOne({ fund_id: fundRaiserID });
            initFundRaise[field].push(imageName);

            let currentPIctures = initFundRaise.picture;
            let currentDocuments = initFundRaise.documents;

            console.log(currentPIctures);
            console.log(currentDocuments);

            await initFundRaise.save()
            // await InitFundRaisingModel.updateOne({
            //     fund_id: fundRaiserID
            // }, {
            //     $push: {
            //         [field]: imageName
            //     }
            // });

            let promisify = util.promisify(images.mv);
            await promisify(path)

            return {
                picture: currentPIctures,
                documents: currentDocuments
            }
        } catch (e) {
            console.log(e);
            return false
        }
    },


    deleteImage: async (fund_id, type, image) => {
        try {
            let findData = await InitFundRaisingModel.findOne({ fund_id: fund_id });
            if (findData) {
                let field = type == "Documents" ? "documents" : "picture";
                console.log(field);
                console.log(image);
                findData[field] = [...findData[field].filter((each) => each != image)]
                await findData.save()
                return true
            } else {
                return false
            }
        } catch (e) {
            console.log(e);
            return false
        }
    },



    fundRaiserUpdate: (data, edit_id) => {
        return new Promise(async (resolve, reject) => {

            console.log(data);

            let newImages = [];
            let newDocument = []

            //get images
            if (data.images) {
                //image type  ['Document','Images'];

                let imageName;
                let imagesType = data.images?.d;
                let allImages = data.images?.data;

                if (imagesType) {
                    return reject({ status: 400, msg: "Please provide valid image type" })
                }

                if (!allImages) {
                    return reject({ status: 400, msg: "Please provide valid images" })
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