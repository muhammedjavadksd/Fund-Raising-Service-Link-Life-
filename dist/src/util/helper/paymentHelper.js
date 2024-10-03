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
const axios_1 = __importDefault(require("axios"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs_1 = __importDefault(require("fs"));
const qrcode_1 = __importDefault(require("qrcode"));
const s3Bucket_1 = __importDefault(require("./s3Bucket"));
const ConstData_1 = require("../../types/Enums/ConstData");
const path_1 = __importDefault(require("path"));
const dotenv_1 = require("dotenv");
class PaymentHelper {
    verifyPayment(order_id) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const create = yield axios_1.default.get(`${process.env.PAYMENT_BASE_ENDPOINT}/pg/orders/${order_id}`, config);
                const response_data = create.data;
                console.log(response_data);
                if (response_data.order_status != "PAID")
                    return false;
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
                };
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
    }
    createOrder(order_id, amount, item_name, items, profile_id, email_address, phone, full_name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customeProfileId = full_name.replace(/[^a-zA-Z0-9]/g, '');
                (0, dotenv_1.config)();
                const data = {
                    cart_details: {
                        cart_name: item_name,
                        cart_items: items
                    },
                    customer_details: {
                        customer_id: profile_id ? profile_id.replaceAll("@", "_") : customeProfileId,
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
                const create = yield axios_1.default.post(`${process.env.PAYMENT_BASE_ENDPOINT}/pg/orders`, data, configData);
                const response_data = create.data;
                return response_data;
            }
            catch (e) {
                console.log(e);
                return null;
            }
        });
    }
    createReceipt(name, title, amount, date, qrtext) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const s3Helper = new s3Bucket_1.default(process.env.FUND_RAISER_BUCKET || "", ConstData_1.S3Folder.FundRaiserCertificate);
                const fileName = `${title}_${name}_payment_certificate_.pdf`;
                const presignedUrl = yield s3Helper.generatePresignedUrl(fileName);
                const qr = yield qrcode_1.default.toDataURL(qrtext);
                const doc = new pdfkit_1.default({
                    layout: 'landscape',
                    size: 'A4',
                });
                function jumpLine(doc, lines) {
                    for (let index = 0; index < lines; index++) {
                        doc.moveDown();
                    }
                }
                const distanceMargin = 18;
                const maxWidth = 140;
                const maxHeight = 70;
                doc.pipe(fs_1.default.createWriteStream('output.pdf'));
                doc.rect(0, 0, doc.page.width, doc.page.height).fill('#fff');
                doc.fontSize(10);
                doc.fillAndStroke('#0e8cc3').lineWidth(20).lineJoin('round').rect(distanceMargin, distanceMargin, doc.page.width - distanceMargin * 2, doc.page.height - distanceMargin * 2).stroke();
                const avatarImage = yield axios_1.default.get('https://fund-raiser.s3.amazonaws.com/other-images/9189.jpg', { responseType: "arraybuffer" });
                const signBuffer = yield axios_1.default.get('https://fund-raiser.s3.amazonaws.com/other-images/sign.png', { responseType: "arraybuffer" });
                doc.image(avatarImage.data, doc.page.width / 2 - maxWidth / 2, 60, {
                    fit: [maxWidth, maxHeight],
                    align: 'center',
                });
                jumpLine(doc, 5);
                doc
                    .fontSize(10)
                    .fill('#021c27')
                    .text('Life link donation certificate', {
                    align: 'center',
                });
                jumpLine(doc, 2);
                // Content
                doc
                    .fontSize(16)
                    .fill('#021c27')
                    .text(`Receipt of the payment for ${title}`, {
                    align: 'center',
                });
                jumpLine(doc, 1);
                doc
                    .fontSize(10)
                    .fill('#021c27')
                    .text('Present to', {
                    align: 'center',
                });
                jumpLine(doc, 2);
                doc
                    .fontSize(24)
                    .fill('#021c27')
                    .text(name, {
                    align: 'center',
                });
                jumpLine(doc, 1);
                doc
                    .fontSize(15)
                    .fill('#021c27')
                    .text(`Successfully donated amount of ${amount} rupees on ${date}`, {
                    align: 'center',
                });
                jumpLine(doc, 1);
                doc
                    .fontSize(10)
                    .fill('#021c27')
                    .text(`"We're thrilled to have you with us on this journey. Thank you!"`, {
                    align: 'center',
                });
                jumpLine(doc, 7);
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
                const pathResolve = path_1.default.resolve(process.cwd(), "output.pdf");
                doc.on("end", () => __awaiter(this, void 0, void 0, function* () {
                    fs_1.default.readFile(pathResolve, function (err, data) {
                        return __awaiter(this, void 0, void 0, function* () {
                            if (err) {
                                console.log(err);
                            }
                            const savedName = yield s3Helper.uploadFile(data, presignedUrl, "application/pdf", fileName);
                            if (savedName) {
                                console.log(savedName);
                                resolve(savedName);
                            }
                            else {
                                reject(null);
                            }
                        });
                    });
                }));
                doc.end();
            }
            catch (e) {
                reject(null);
            }
        }));
    }
}
exports.default = PaymentHelper;
