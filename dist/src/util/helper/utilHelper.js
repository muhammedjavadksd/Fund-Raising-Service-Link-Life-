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
const DbEnum_1 = require("../../types/Enums/DbEnum");
const url_1 = __importDefault(require("url"));
const axios_1 = __importDefault(require("axios"));
class UtilHelper {
    constractor() {
        this.createFundRaiseID = this.createFundRaiseID.bind(this);
        this.createRandomText = this.createRandomText.bind(this);
        this.generateAnOTP = this.generateAnOTP.bind(this);
    }
    createFundRaiseID(created_by) {
        const createdBY = created_by == DbEnum_1.FundRaiserCreatedBy.USER ? "U" : (created_by == DbEnum_1.FundRaiserCreatedBy.ADMIN ? "A" : "O");
        const fundId = this.createRandomText(5) + "-" + createdBY + "-" + new Date().getUTCMilliseconds();
        return fundId;
    }
    generateAnOTP(length) {
        const min = Math.pow(10, length - 1);
        const max = Math.pow(10, length) - 1;
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        return randomNumber;
    }
    createRandomText(length) {
        const characters = 'abcdefghijklmnopqrstuvwxyz';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    extractImageNameFromPresignedUrl(presigned_url) {
        try {
            const newUrl = url_1.default.parse(presigned_url, true);
            console.log("Presigned url");
            console.log(presigned_url);
            if (newUrl.pathname) {
                const pathName = newUrl.pathname.split("/");
                const path = `${pathName[1]}/${pathName[2]}`;
                return path;
            }
            else {
                return false;
            }
        }
        catch (e) {
            return false;
        }
    }
    generateFundRaiserTitle(profile) {
        return `${profile.full_name}'s Fund Raiser for ${profile.category} in ${profile.district}`;
    }
    formatDateToMonthNameAndDate(date) {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const d = new Date(date);
        const monthName = months[d.getMonth()];
        const day = d.getDate();
        const year = d.getFullYear();
        return `${monthName} ${day} ${year} `;
    }
    convertFundIdToBeneficiaryId(fund_id, ifsc) {
        return fund_id.replaceAll("-", "_").concat(ifsc);
    }
    bufferFromImage(image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const imageRequest = yield axios_1.default.get(image, { responseType: "arraybuffer" });
                return imageRequest.data;
            }
            catch (e) {
                return null;
            }
        });
    }
    createFundRaiserReport() {
        return __awaiter(this, void 0, void 0, function* () {
            // const writeStream = fs.createWriteStream('Fundraiser_Report.pdf');
            const PDFDocument = require('pdfkit');
            const fs = require('fs');
            // Create a new PDF document
            const doc = new PDFDocument({ margin: 50 });
            // Pipe the document to a writable stream to save it
            doc.pipe(fs.createWriteStream('annual_report.pdf'));
            // Add logo (replace with actual logo path)
            // doc.image('path/to/logo.png', 195, 50, { width: 95, height: 78 });
            // Add the title and company information
            doc
                .fontSize(20)
                .text('QuantumTech Industries', { align: 'center' })
                .fontSize(10)
                .text('quantumtechl.com | 222 555 7777', { align: 'center' })
                .moveDown(2);
            // Add the Annual Report title
            doc
                .fontSize(25)
                .text('ANNUAL REPORT 2082', { align: 'center' })
                .moveDown();
            // Prepared by information
            doc
                .fontSize(12)
                .text('Prepared By:', { align: 'center' })
                .fontSize(12)
                .text('Jane Smith', { align: 'center' })
                .text('December 28, 2082', { align: 'center' })
                .moveDown(2);
            // Table of Contents
            doc
                .fontSize(14)
                .text('TABLE OF CONTENTS', { underline: true })
                .moveDown()
                .fontSize(12)
                .text('Objectives......................................................... 4')
                .text('Scope................................................................. 4')
                .text('Methodology.................................................... 4')
                .text('Findings')
                .text('    Financial Performance..................................... 5')
                .text('    Product Performance...................................... 6')
                .text('    R&D Breakthroughs...................................... 6')
                .text('    Sustainability Efforts....................................... 6')
                .text('    Employee Welfare and Satisfaction............... 7')
                .text('Recommendations................................................ 8')
                .text('Conclusion......................................................... 9')
                .moveDown(2);
            // Executive Summary
            doc
                .fontSize(18)
                .text('Executive Summary', { align: 'center' })
                .moveDown();
            doc
                .fontSize(12)
                .text('In 2082, QuantumTech Industries, a global leader in next-generation quantum computing solutions, witnessed remarkable growth and advancements.', {
                align: 'left',
                indent: 40,
            })
                .moveDown();
            doc
                .text('The company successfully launched our QuantumServer X2, which accounted for 35% of our total sales.', {
                align: 'left',
                indent: 40,
            })
                .moveDown();
            doc
                .text('Additionally, line with global sustainability targets.', {
                align: 'left',
                indent: 40,
            })
                .moveDown();
            doc
                .text('Employee satisfaction rates soared to 95%, attributing to our revamped HR policies and work environment enhancements.', {
                align: 'left',
                indent: 40,
            })
                .moveDown();
            doc
                .text('In light of these achievements, QuantumTech stands robust, future-ready, and poised for another groundbreaking year in 2083.', {
                align: 'left',
                indent: 40,
            })
                .moveDown(2);
            // Company Background
            doc
                .fontSize(12)
                .text('QuantumTech Industries, founded in 2045, has consistently been at the vanguard of quantum computing innovations. With its excellence, innovation, and stakeholder engagement.', {
                align: 'left',
                indent: 40,
            })
                .moveDown(2);
            // Objectives
            doc
                .fontSize(18)
                .text('Objectives', { align: 'left' })
                .moveDown(1);
            doc
                .fontSize(12)
                .text('This annual report aims to provide our stakeholders, including shareholders, employees, customers, and partners, with a transparent and to highlight our future strategies, objectives, and potential challenges.', {
                align: 'left',
                indent: 40,
            })
                .moveDown(2);
            // Scope
            doc
                .fontSize(18)
                .text('Scope', { align: 'left' })
                .moveDown(1);
            doc
                .fontSize(12)
                .text('This report will delve into the company\'s financial performance, product launches, R&D advancements, sustainability efforts, and employee welfare initiatives undertaken in 2082. It will not cover specific technical details of our products or proprietary research methodologies.', {
                align: 'left',
                indent: 40,
            })
                .moveDown(2);
            // Methodology
            doc
                .fontSize(18)
                .text('Methodology', { align: 'left' })
                .moveDown(1);
            doc
                .fontSize(12)
                .text('To ensure a comprehensive and accurate representation of QuantumTech\'s performance in 2082, multiple methods and sources of data collection were utilized:', {
                align: 'left',
                indent: 40,
            })
                .moveDown(1);
            // List of Methodology items
            doc
                .text('1. Financial Data: Sourced from our internal finance department, audited by the reputable external firm, Stellar Audit Solutions.', {
                align: 'left',
                indent: 60,
            })
                .moveDown(1);
            doc
                .text('2. Sales and Product Performance: Derived from our global sales database and analyzed using advanced data analytics tools to discern patterns and trends.', {
                align: 'left',
                indent: 60,
            })
                .moveDown(1);
            doc
                .text('3. R&D Updates: Gathered directly from our research and development teams, emphasizing significant breakthroughs and future potentials.', {
                align: 'left',
                indent: 60,
            })
                .moveDown(2);
            // Find other sections (Findings, Recommendations, etc.) similarly.
            // Finalize the PDF and end the stream
            doc.end();
            // writeStream.on('finish', () => {
            //     console.log('PDF generated successfully: Fundraiser_Report.pdf');
            // });
        });
    }
}
exports.default = UtilHelper;
