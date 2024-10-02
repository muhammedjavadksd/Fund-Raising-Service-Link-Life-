import axios from "axios"
import { IOrderTemplate, IPaymentItem, IVerifyPaymentResponse } from "../../types/Interface/Util";
import PDFDocument, { file, path } from 'pdfkit'
import fs from 'fs'
import qrcode from 'qrcode'
import { Base64Encode } from 'base64-stream'
import S3BucketHelper from "./s3Bucket";
import { PassThrough } from 'stream';
import blobStream from 'blob-stream'
import { S3Folder } from "../../types/Enums/ConstData";
import fspath from 'path'
import { config } from 'dotenv'

interface IPaymentHelper {
    verifyPayment(order_id: string): Promise<IVerifyPaymentResponse | false>
    createOrder(order_id: string, amount: number, item_name: string, items: IPaymentItem[], profile_id: string, email_address: string, phone: number, full_name: string): Promise<IOrderTemplate | null>
}


class PaymentHelper implements IPaymentHelper {

    async verifyPayment(order_id: string): Promise<IVerifyPaymentResponse | false> {
        const config = {
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'x-api-version': '2023-08-01',
                'x-client-id': process.env.x_client_id,
                'x-client-secret': process.env.x_client_secret
            }
        };
        try {
            const create = await axios.get(`${process.env.PAYMENT_BASE_ENDPOINT}/pg/orders/${order_id}`, config);
            const response_data: IOrderTemplate = create.data;
            console.log(response_data);

            if (response_data.order_status != "PAID") return false
            return {
                data: {
                    cart_details: response_data.cart_details,
                    created_at: response_data.created_at,
                    customer_details: response_data.customer_details,
                    order: {
                        order_amount: response_data.order_amount,
                        order_currency: response_data.order_currency,
                        order_id: response_data.order_id
                    },
                    payment: {
                        cf_payment_id: +response_data.payment_session_id,
                        payment_amount: response_data.order_amount,
                        payment_currency: response_data.order_currency,
                        payment_status: response_data.order_status,
                        payment_time: response_data.order_expiry_time
                    },
                    order_status: response_data.order_status
                }
            }
        } catch (e) {
            console.log(e);

            return false;
        }
    }


    async createOrder(order_id: string, amount: number, item_name: string, items: IPaymentItem[], profile_id: string, email_address: string, phone: number, full_name: string): Promise<IOrderTemplate | null> {
        try {
            config()
            const data = {
                cart_details: {
                    cart_name: item_name,
                    cart_items: items
                },
                customer_details: {
                    customer_id: profile_id ? profile_id.replaceAll("@", "_") : full_name.replaceAll("@", "_"),
                    customer_email: email_address,
                    customer_phone: phone.toString(),
                    customer_name: full_name
                },
                order_id: order_id,
                order_amount: amount,
                order_currency: "INR",
                order_meta: {
                    return_url: `${process.env.PAYMENT_SUCCESS_ENDPOINT}/${order_id}`
                }
            };


            console.log(data);

            const configData = {
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json',
                    'x-api-version': '2023-08-01',
                    'x-client-id': process.env.x_client_id,
                    'x-client-secret': process.env.x_client_secret
                }
            };
            const create = await axios.post(`${process.env.PAYMENT_BASE_ENDPOINT}/pg/orders`, data, configData);
            const response_data = create.data;
            return response_data;
        } catch (e) {
            console.log(e);
            return null
        }
    }


    createReceipt(name: string, title: string, amount: number, date: string, qrtext: string): Promise<string> {
        return new Promise(async (resolve, reject) => {


            try {
                const s3Helper = new S3BucketHelper(process.env.FUND_RAISER_BUCKET || "", S3Folder.FundRaiserCertificate);
                const fileName = `${title}_${name}_payment_certificate_.pdf`
                const presignedUrl = await s3Helper.generatePresignedUrl(fileName)
                const qr = await qrcode.toDataURL(qrtext);

                const doc = new PDFDocument({
                    layout: 'landscape',
                    size: 'A4',
                });

                function jumpLine(doc: PDFKit.PDFDocument, lines: number) {
                    for (let index = 0; index < lines; index++) {
                        doc.moveDown();
                    }
                }

                const distanceMargin = 18;
                const maxWidth = 140;
                const maxHeight = 70;
                doc.pipe(fs.createWriteStream('output.pdf'));
                doc.rect(0, 0, doc.page.width, doc.page.height).fill('#fff');
                doc.fontSize(10);
                doc.fillAndStroke('#0e8cc3').lineWidth(20).lineJoin('round').rect(
                    distanceMargin,
                    distanceMargin,
                    doc.page.width - distanceMargin * 2,
                    doc.page.height - distanceMargin * 2,
                ).stroke();

                const avatarImage = await axios.get('https://fund-raiser.s3.amazonaws.com/other-images/9189.jpg', { responseType: "arraybuffer" })
                const signBuffer = await axios.get('https://fund-raiser.s3.amazonaws.com/other-images/sign.png', { responseType: "arraybuffer" })
                doc.image(avatarImage.data, doc.page.width / 2 - maxWidth / 2, 60, {
                    fit: [maxWidth, maxHeight],
                    align: 'center',
                });

                jumpLine(doc, 5)

                doc
                    .fontSize(10)
                    .fill('#021c27')
                    .text('Life link donation certificate', {
                        align: 'center',
                    });

                jumpLine(doc, 2)

                // Content
                doc
                    .fontSize(16)
                    .fill('#021c27')
                    .text(`Receipt of the payment for ${title}`, {
                        align: 'center',
                    });

                jumpLine(doc, 1)

                doc

                    .fontSize(10)
                    .fill('#021c27')
                    .text('Present to', {
                        align: 'center',
                    });

                jumpLine(doc, 2)

                doc

                    .fontSize(24)
                    .fill('#021c27')
                    .text(name, {
                        align: 'center',
                    });

                jumpLine(doc, 1)

                doc
                    .fontSize(15)
                    .fill('#021c27')
                    .text(`Successfully donated amount of ${amount} rupees on ${date}`, {
                        align: 'center',
                    });

                jumpLine(doc, 1)
                doc
                    .fontSize(10)
                    .fill('#021c27')
                    .text(`"We're thrilled to have you with us on this journey. Thank you!"`, {
                        align: 'center',
                    });
                jumpLine(doc, 7)

                doc.lineWidth(1);

                // Signatures
                const lineSize = 174;
                const signatureHeight = 390;

                doc.fillAndStroke('#021c27');
                doc.strokeOpacity(0.2);

                const startLine1 = 128;
                const endLine1 = 128 + lineSize;
                doc
                    .moveTo(startLine1, signatureHeight)
                    .lineTo(endLine1, signatureHeight)
                    .stroke();

                const startLine2 = endLine1 + 32;
                const endLine2 = startLine2 + lineSize;


                const startLine3 = endLine2 + 32;
                const endLine3 = startLine3 + lineSize;

                doc.image(signBuffer.data, (doc.page.width / 2 - maxWidth / 2) + 40, 350, {
                    fit: [maxWidth - 70, maxHeight],
                    align: 'center',
                });


                doc.image(signBuffer.data, 600, 350, {
                    fit: [maxWidth - 70, maxHeight],
                    align: 'center',
                });



                doc

                    .fontSize(10)
                    .fill('#021c27')
                    .text('John Doe', startLine1, signatureHeight + 10, {
                        columns: 1,
                        columnGap: 0,
                        height: 40,
                        width: lineSize,
                        align: 'center',
                    });

                doc

                    .fontSize(10)
                    .fill('#021c27')
                    .text('Associate Professor', startLine1, signatureHeight + 25, {
                        columns: 1,
                        columnGap: 0,
                        height: 40,
                        width: lineSize,
                        align: 'center',
                    });

                doc

                    .fontSize(10)
                    .fill('#021c27')
                    .text(name, startLine2, signatureHeight + 10, {
                        columns: 1,
                        columnGap: 0,
                        height: 40,
                        width: lineSize,
                        align: 'center',
                    });

                doc

                    .fontSize(10)
                    .fill('#021c27')
                    .text('Name', startLine2, signatureHeight + 25, {
                        columns: 1,
                        columnGap: 0,
                        height: 40,
                        width: lineSize,
                        align: 'center',
                    });

                doc

                    .fontSize(10)
                    .fill('#021c27')
                    .text('Jane Doe', startLine3, signatureHeight + 10, {
                        columns: 1,
                        columnGap: 0,
                        height: 40,
                        width: lineSize,
                        align: 'center',
                    });

                doc.image(signBuffer.data, 180, 350, {
                    fit: [maxWidth - 70, maxHeight],
                    align: 'center',
                });

                doc

                    .fontSize(10)
                    .fill('#021c27')
                    .text('Director', startLine3, signatureHeight + 25, {
                        columns: 1,
                        columnGap: 0,
                        height: 40,
                        width: lineSize,
                        align: 'center',
                    });

                doc
                    .moveTo(startLine3, signatureHeight)
                    .lineTo(endLine3, signatureHeight)
                    .stroke();
                jumpLine(doc, 4);

                doc
                    .moveTo(startLine2, signatureHeight)
                    .lineTo(endLine2, signatureHeight)
                    .stroke();

                doc.fontSize(10)
                    .fill('#021c27')
                    .text('Scan below QRCODE for verification', 330, 450, {
                        columns: 1,
                        columnGap: 0,
                        height: 40,
                        width: lineSize,
                        align: 'center',
                    });

                doc.image(qr, 380, 470, {
                    fit: [maxWidth - 70, maxHeight],
                    align: 'center',
                });


                const pathResolve = fspath.resolve(process.cwd(), "output.pdf")
                doc.on("end", async () => {
                    fs.readFile(pathResolve, async function (err, data) {
                        if (err) {
                            console.log(err);
                        }

                        const savedName = await s3Helper.uploadFile(data, presignedUrl, "application/pdf", fileName)
                        if (savedName) {
                            console.log(savedName);
                            resolve(savedName)
                        } else {
                            reject(null)
                        }
                    });
                })
                doc.end()
            } catch (e) {
                reject(null)
            }
        })
    }
}


export default PaymentHelper
