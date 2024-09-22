"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const axios_1 = __importDefault(require("axios"));
const utilHelper_1 = __importDefault(require("./utilHelper"));
class S3BucketHelper {
    constructor(bucketName, folderName) {
        this.bucketName = bucketName;
        this.folderName = folderName;
        this.s3 = new aws_sdk_1.default.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            signatureVersion: 'v4',
        });
    }
    generatePresignedUrl(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const signedUrlExpireSeconds = 60 * 5;
            const filePath = this.folderName ? `${this.folderName}/${key}` : key;
            console.log("Bucket name");
            console.log(this.bucketName);
            const url = this.s3.getSignedUrl("putObject", {
                Bucket: this.bucketName,
                Key: filePath,
                Expires: signedUrlExpireSeconds
            });
            return url;
        });
    }
    uploadObject(key, docs, ftype) {
        return __awaiter(this, void 0, void 0, function* () {
            const save = yield this.s3.upload({
                Bucket: this.bucketName,
                Key: key,
                Body: docs,
                ACL: 'public-read',
                ContentType: ftype
            }).promise();
            console.log(save);
            console.log("Save");
            console.log(save.Location);
        });
    }
    uploadFile(file, presigned_url, fileType, imageName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const utlHelper = new utilHelper_1.default();
                const folderPath = utlHelper.extractImageNameFromPresignedUrl(presigned_url);
                yield axios_1.default.put(presigned_url, file, {
                    headers: { "Content-Type": fileType, }
                });
                const imageUrl = `http://${this.bucketName}.s3.amazonaws.com/${folderPath}`;
                return imageUrl;
            }
            catch (e) {
                return false;
            }
        });
    }
    findFile(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = {
                    Bucket: this.bucketName,
                    Key: fileName,
                };
                const headData = yield this.s3.headObject(params).promise();
                if (headData) {
                    return true;
                }
                return false;
            }
            catch (e) {
                return false;
            }
        });
    }
}
exports.default = S3BucketHelper;
