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
    private readonly s3;

    constructor(bucketName: string) {
        this.bucketName = bucketName;
        this.s3Config = new S3Client({
            endpoint: "http://localhost:4566",
            credentials: fromEnv(),
            region: 'us-west-1',
            forcePathStyle: true,
        })

        this.s3 = new AWS.S3({
            endpoint: "http://localhost:4566",
            accessKeyId: process.env.x_client_id,
            secretAccessKey: process.env.x_client_secret,
            region: "us-east-1",  // specify the region
            s3ForcePathStyle: true // use path-style URL, necessary for LocalStack
        });


    }

    async generatePresignedUrl(key: string): Promise<string> {
        const url = await getSignedUrl(this.s3Config, new PutObjectCommand({ Bucket: this.bucketName, Key: key }), { expiresIn: 3600 })
        return url;
    }


    async uploadObject(key: string, docs: Buffer, ftype: string) {

        console.log(this.bucketName);

        console.log(docs);

        // await this.s3.createBucket({ Bucket: this.bucketName }).promise();
        const save = await this.s3.upload({
            Bucket: this.bucketName,
            Key: key,
            Body: docs,
            ACL: 'public-read',
            // ContentEncoding: fEncoding,
            ContentType: "application/pdf"
        }
        ).promise()
        console.log(save);

        console.log("Save");
        console.log(save.Location);
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