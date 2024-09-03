import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-provider-env";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import AWS from 'aws-sdk'
import axios from 'axios'

interface IS3BucketHelper {
    generatePresignedUrl(key: string): Promise<string>
    uploadFile(file: Buffer, presigned_url: string): Promise<boolean>
}

class S3BucketHelper {

    private readonly bucketName;
    private readonly s3Config;

    constructor(bucketName: string) {
        this.bucketName = bucketName;
        this.s3Config = new S3Client({
            endpoint: "http://localhost:4566",
            credentials: fromEnv(),
            region: 'us-east-1',
            forcePathStyle: true,
        })
    }

    async generatePresignedUrl(key: string): Promise<string> {
        const url = await getSignedUrl(this.s3Config, new PutObjectCommand({ Bucket: this.bucketName, Key: key }), { expiresIn: 3600 })
        return url;
    }

    async uploadFile(file: Buffer, presigned_url: string, fileType: string, imageName: string): Promise<boolean | string> {
        try {
            await axios.put(presigned_url, file, { headers: { "Content-Type": fileType, } })
            const imageUrl = `http://localhost:4566/${this.bucketName}/${imageName}`
            return imageUrl
        } catch (e) {
            return false
        }
    }

}

export default S3BucketHelper