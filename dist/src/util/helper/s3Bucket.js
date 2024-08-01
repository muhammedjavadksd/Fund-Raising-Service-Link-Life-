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
const client_s3_1 = require("@aws-sdk/client-s3");
const credential_provider_env_1 = require("@aws-sdk/credential-provider-env");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const axios_1 = __importDefault(require("axios"));
class S3BucketHelper {
    constructor(bucketName) {
        this.bucketName = bucketName;
        this.s3Config = new client_s3_1.S3Client({
            endpoint: "http://localhost:4566",
            credentials: (0, credential_provider_env_1.fromEnv)(),
            region: 'us-east-1',
            forcePathStyle: true,
        });
    }
    generatePresignedUrl(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = yield (0, s3_request_presigner_1.getSignedUrl)(this.s3Config, new client_s3_1.PutObjectCommand({ Bucket: this.bucketName, Key: key }), { expiresIn: 3600 });
            return url;
        });
    }
    uploadFile(file, presigned_url, fileType, imageName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield axios_1.default.put(presigned_url, file, { headers: { "Content-Type": fileType, } });
                const imageUrl = `http://localhost:4566/${this.bucketName}/${imageName}`;
                return imageUrl;
            }
            catch (e) {
                return false;
            }
        });
    }
}
exports.default = S3BucketHelper;
