import FundRaiserRepo from "../repositorys/FundRaiserRepo";
import { FundRaiserCreatedBy, FundRaiserStatus } from "../types/Enums/DbEnum";
import { FundRaiserFileType } from "../types/Enums/UtilEnum";
import { IEditableFundRaiser, IFundRaiseInitialData, iFundRaiseModel } from "../types/Interface/IDBmodel";
import { IFundRaiserService } from "../types/Interface/IService";
import { HelperFuncationResponse } from "../types/Interface/Util";
import fs from 'fs'
import { UploadedFile } from 'express-fileupload'



class FundRaiserService implements IFundRaiserService {

    private readonly FundRaiserRepo;

    constructor() {
        this.deleteImage = this.deleteImage.bind(this)
        this.createFundRaisePost = this.createFundRaisePost.bind(this)
        this.getOwnerFundRaise = this.getOwnerFundRaise.bind(this)
        this.closeFundRaiser = this.closeFundRaiser.bind(this)
        this.updateStatus = this.updateStatus.bind(this)
        this.editFundRaiser = this.editFundRaiser.bind(this)
        this.uploadImage = this.uploadImage.bind(this)

        this.FundRaiserRepo = new FundRaiserRepo();
    }

    async deleteImage(fund_id: string, type: FundRaiserFileType, image: string): Promise<boolean> {
        try {
            let findData = await this.FundRaiserRepo.findFundPostByFundId(fund_id) // await InitFundRaisingModel.findOne({ fund_id: fund_id });
            if (findData) {
                let field: "documents" | "picture" = (type == FundRaiserFileType.Document) ? "documents" : "picture";
                const filterImage = findData[field].filter((each) => each != image)
                findData[field] = [...filterImage]
                await this.FundRaiserRepo.updateFundRaiserByModel(findData);
                return true
            } else {
                return false
            }
        } catch (e) {
            console.log(e);
            return false
        }
    }

    async createFundRaisePost(data: IFundRaiseInitialData): Promise<HelperFuncationResponse> {
        console.log("Da");

        console.log(data);

        try {
            const createFundRaise = await this.FundRaiserRepo.createFundRaiserPost(data) //this.createFundRaisePost(data);
            return {
                status: createFundRaise.status,
                msg: createFundRaise.msg,
                data: {
                    id: createFundRaise.data?.id,
                    fund_id: createFundRaise.data?.fund_id
                },
                statusCode: createFundRaise.statusCode
            }
        } catch (e) {
            return {
                status: false,
                msg: "Internal server error",
                statusCode: 500
            }
        }
    }

    async getOwnerFundRaise(owner_id: string, owner_type: FundRaiserCreatedBy): Promise<HelperFuncationResponse> {
        try {
            if (owner_id) {
                let fundraiser_data;
                if (owner_type == FundRaiserCreatedBy.ORGANIZATION) {
                    fundraiser_data = await this.FundRaiserRepo.getOrganizationPosts(owner_id);
                } else if (owner_type == FundRaiserCreatedBy.USER) {
                    fundraiser_data = await this.FundRaiserRepo.getUserPosts(owner_id);
                }

                if (fundraiser_data && fundraiser_data?.length) {
                    return {
                        msg: "Data fetched success",
                        status: true,
                        statusCode: 200,
                        data: fundraiser_data
                    }
                } else {
                    return {
                        msg: "No data found",
                        status: false,
                        statusCode: 400
                    }
                }
            } else {
                return {
                    msg: "Please provide valid user id",
                    status: false,
                    statusCode: 401
                }
            }
        } catch (e) {
            console.log(e);
            return {
                msg: "Internal server error",
                status: false,
                statusCode: 500
            }
        }
    }

    async closeFundRaiser(fund_id: string): Promise<HelperFuncationResponse> {
        try {
            const currentFund: iFundRaiseModel | null = await this.FundRaiserRepo.findFundPostByFundId(fund_id);
            if (currentFund) {
                if (currentFund.closed) {
                    return {
                        status: false,
                        msg: "This fund raiser is already closed",
                        statusCode: 400,
                    }
                } else {
                    currentFund.closed = true;
                    await this.FundRaiserRepo.updateFundRaiserByModel(currentFund);
                    return {
                        msg: "Fund raiser closed success",
                        status: true,
                        statusCode: 200
                    }
                }
            } else {
                return {
                    msg: "Fund raiser is not available",
                    status: false,
                    statusCode: 400
                }
            }
        } catch (e) {
            return {
                msg: "Internal server error",
                status: false,
                statusCode: 500
            }

        }
    }

    async updateStatus(fund_id: string, newStatus: FundRaiserStatus): Promise<HelperFuncationResponse> {
        try {
            const currentFund: iFundRaiseModel | null = await this.FundRaiserRepo.findFundPostByFundId(fund_id);
            if (currentFund) {
                const currentStatus: FundRaiserStatus = currentFund.status;
                if (currentStatus == newStatus) {
                    return {
                        msg: "Current status is already that you have requested",
                        status: false,
                        statusCode: 401
                    }
                } else {
                    currentFund.status = newStatus;
                    await this.FundRaiserRepo.updateFundRaiserByModel(currentFund);
                    return {
                        status: true,
                        msg: "Status has been updated",
                        statusCode: 200
                    }
                }
            } else {
                return {
                    status: false,
                    msg: "Fund raiser is not available",
                    statusCode: 400
                }
            }
        } catch (e) {
            return {
                status: false,
                msg: "Interanl server error",
                statusCode: 500
            }
        }
    }

    async editFundRaiser(fund_id: string, edit_data: IEditableFundRaiser): Promise<HelperFuncationResponse> {
        try {
            const updateFundRaiserData = await this.FundRaiserRepo.updateFundRaiser(fund_id, edit_data);
            if (updateFundRaiserData) {
                return {
                    msg: "Fund raiser updated success",
                    status: true,
                    statusCode: 200,
                }
            } else {
                return {
                    msg: "Fund raiser updation failed",
                    status: false,
                    statusCode: 400,
                }
            }
        } catch (e) {
            return {
                msg: "Internal server error",
                status: false,
                statusCode: 500,
            }
        }
    }


    async uploadImage(images: UploadedFile[], fundRaiserID: string, document_type: FundRaiserFileType): Promise<HelperFuncationResponse> {
        try {

            let newImages = [];
            const isDocument = document_type == FundRaiserFileType.Document
            let field: 'picture' | 'documents' = document_type == FundRaiserFileType.Document ? "documents" : "picture"
            let imageLength = images.length

            console.log(imageLength);



            for (let fileIndex = 0; fileIndex < imageLength; fileIndex++) {

                let imageName = images[fileIndex].name;

                let path = isDocument ? `public/images/fund_raise_document/${imageName}` : `public/images/fund_raiser_image/${imageName}`;
                newImages.push(imageName)

                const imageBuffer: UploadedFile = images[fileIndex];
                console.log(imageBuffer);

                let bufferImage = imageBuffer.data
                console.log(bufferImage);

                if (bufferImage) {
                    await fs.promises.writeFile(path, Buffer.from(bufferImage));
                }
            }


            let initFundRaise: iFundRaiseModel | null = await this.FundRaiserRepo.findFundPostByFundId(fundRaiserID);;
            console.log(initFundRaise);

            if (initFundRaise) {
                const replaceImage: string[] = initFundRaise[field] //initFundRaise[field] as string[]
                initFundRaise[field] = [...replaceImage, ...newImages]
                await this.FundRaiserRepo.updateFundRaiserByModel(initFundRaise);

                return {
                    msg: "Image uploaded success",
                    status: true,
                    statusCode: 201,
                    data: {
                        picture: initFundRaise.picture,
                        documents: initFundRaise.documents
                    }
                }
            } else {
                return {
                    msg: "Fund id couldn't found",
                    status: false,
                    statusCode: 400,
                }
            }
        } catch (e) {
            console.log(e);
            return {
                msg: "Internal server error",
                status: false,
                statusCode: 500,
            }
        }
    }
}

export default FundRaiserService