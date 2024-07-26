import FundRaiserRepo from "../repositorys/FundRaiserRepo";
import { FundRaiserCreatedBy, FundRaiserStatus } from "../types/Enums/DbEnum";
import { FundRaiserFileType, StatusCode } from "../types/Enums/UtilEnum";
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
    


    async getOwnerSingleProfile(profile_id: string, user_type: FundRaiserCreatedBy, owner_id: string): Promise<HelperFuncationResponse> {
        let fundraiser_data: iFundRaiseModel | null = await this.FundRaiserRepo.findFundPostByFundId(profile_id);
        if (!fundraiser_data) {
            return {
                msg: "No profile found",
                status: false,
                statusCode: StatusCode.NOT_FOUND,
            }
        }
        if (user_type == FundRaiserCreatedBy.ADMIN) {
            return {
                msg: "Data fetched success",
                status: true,
                statusCode: StatusCode.OK,
                data: fundraiser_data
            }
        }

        if (fundraiser_data.user_id == owner_id) {
            return {
                msg: "Data fetched success",
                status: true,
                statusCode: StatusCode.OK,
                data: fundraiser_data
            }
        } else {
            return {
                msg: "Unauthorized access",
                status: false,
                statusCode: StatusCode.UNAUTHORIZED,
            }
        }

    }





    async deleteImage(fund_id: string, type: FundRaiserFileType, image: string): Promise<boolean> {
        try {
            const findData = await this.FundRaiserRepo.findFundPostByFundId(fund_id) // await InitFundRaisingModel.findOne({ fund_id: fund_id });
            if (findData) {
                const field: "documents" | "picture" = (type == FundRaiserFileType.Document) ? "documents" : "picture";
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
                statusCode: StatusCode.SERVER_ERROR
            }
        }
    }

    async getOwnerFundRaise(owner_id: string, owner_type: FundRaiserCreatedBy, limit: number, skip: number): Promise<HelperFuncationResponse> {
        try {
            if (owner_id) {
                let fundraiser_data;
                if (owner_type == FundRaiserCreatedBy.ORGANIZATION) {
                    fundraiser_data = await this.FundRaiserRepo.getOrganizationPosts(owner_id, skip, limit);
                } else if (owner_type == FundRaiserCreatedBy.USER) {
                    fundraiser_data = await this.FundRaiserRepo.getUserPosts(owner_id);
                }

                if (fundraiser_data && fundraiser_data?.length) {
                    return {
                        msg: "Data fetched success",
                        status: true,
                        statusCode: StatusCode.OK,
                        data: fundraiser_data
                    }
                } else {
                    return {
                        msg: "No data found",
                        status: false,
                        statusCode: StatusCode.NOT_FOUND
                    }
                }
            } else {
                return {
                    msg: "Please provide valid user id",
                    status: false,
                    statusCode: StatusCode.UNAUTHORIZED
                }
            }
        } catch (e) {
            console.log(e);
            return {
                msg: "Internal server error",
                status: false,
                statusCode: StatusCode.SERVER_ERROR
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
                        statusCode: StatusCode.BAD_REQUESR,
                    }
                } else {
                    currentFund.closed = true;
                    await this.FundRaiserRepo.updateFundRaiserByModel(currentFund);
                    return {
                        msg: "Fund raiser closed success",
                        status: true,
                        statusCode: StatusCode.OK
                    }
                }
            } else {
                return {
                    msg: "Fund raiser is not available",
                    status: false,
                    statusCode: StatusCode.BAD_REQUESR
                }
            }
        } catch (e) {
            return {
                msg: "Internal server error",
                status: false,
                statusCode: StatusCode.SERVER_ERROR
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
                        statusCode: StatusCode.UNAUTHORIZED
                    }
                } else {
                    currentFund.status = newStatus;
                    await this.FundRaiserRepo.updateFundRaiserByModel(currentFund);
                    return {
                        status: true,
                        msg: "Status has been updated",
                        statusCode: StatusCode.OK
                    }
                }
            } else {
                return {
                    status: false,
                    msg: "Fund raiser is not available",
                    statusCode: StatusCode.BAD_REQUESR
                }
            }
        } catch (e) {
            return {
                status: false,
                msg: "Interanl server error",
                statusCode: StatusCode.SERVER_ERROR
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
                    statusCode: StatusCode.OK,
                }
            } else {
                return {
                    msg: "Fund raiser updation failed",
                    status: false,
                    statusCode: StatusCode.BAD_REQUESR,
                }
            }
        } catch (e) {
            return {
                msg: "Internal server error",
                status: false,
                statusCode: StatusCode.SERVER_ERROR,
            }
        }
    }


    async uploadImage(images: UploadedFile[], fundRaiserID: string, document_type: FundRaiserFileType): Promise<HelperFuncationResponse> {
        try {

            const newImages = [];
            const isDocument = document_type == FundRaiserFileType.Document
            const field: 'picture' | 'documents' = document_type == FundRaiserFileType.Document ? "documents" : "picture"
            const imageLength = images.length

            for (let fileIndex = 0; fileIndex < imageLength; fileIndex++) {

                const imageName = images[fileIndex].name;
                const path = isDocument ? `public/images/fund_raise_document/${imageName}` : `public/images/fund_raiser_image/${imageName}`;

                newImages.push(imageName)

                const imageBuffer: UploadedFile = images[fileIndex];
                console.log(imageBuffer);

                const bufferImage = imageBuffer.data
                console.log(bufferImage);

                if (bufferImage) {
                    await fs.promises.writeFile(path, Buffer.from(bufferImage));
                }
            }


            const initFundRaise: iFundRaiseModel | null = await this.FundRaiserRepo.findFundPostByFundId(fundRaiserID);;
            console.log(initFundRaise);

            if (initFundRaise) {
                const replaceImage: string[] = initFundRaise[field] //initFundRaise[field] as string[]
                initFundRaise[field] = [...replaceImage, ...newImages]
                await this.FundRaiserRepo.updateFundRaiserByModel(initFundRaise);

                return {
                    msg: "Image uploaded success",
                    status: true,
                    statusCode: StatusCode.CREATED,
                    data: {
                        picture: initFundRaise.picture,
                        documents: initFundRaise.documents
                    }
                }
            } else {
                return {
                    msg: "Fund id couldn't found",
                    status: false,
                    statusCode: StatusCode.BAD_REQUESR,
                }
            }
        } catch (e) {
            console.log(e);
            return {
                msg: "Internal server error",
                status: false,
                statusCode: StatusCode.SERVER_ERROR,
            }
        }
    }
}

export default FundRaiserService