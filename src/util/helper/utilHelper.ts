import { FundRaiserCreatedBy } from "../../types/Enums/DbEnum";
import { IFundRaise } from "../../types/Interface/IDBmodel";
import { IUtilHelper } from "../../types/Interface/IHelper";
import url from 'url'
import fs from 'fs'
import pdfkit from 'pdfkit'
import axios from "axios";


class UtilHelper implements IUtilHelper {


    constractor() {
        this.createFundRaiseID = this.createFundRaiseID.bind(this)
        this.createRandomText = this.createRandomText.bind(this)
        this.generateAnOTP = this.generateAnOTP.bind(this)
    }

    createFundRaiseID(created_by: FundRaiserCreatedBy): string {
        const createdBY: string = created_by == FundRaiserCreatedBy.USER ? "U" : (created_by == FundRaiserCreatedBy.ADMIN ? "A" : "O");

        const fundId: string = this.createRandomText(5) + "-" + createdBY + "-" + new Date().getUTCMilliseconds()
        return fundId;
    }

    generateAnOTP(length: number): number {
        const min: number = Math.pow(10, length - 1);
        const max: number = Math.pow(10, length) - 1;
        const randomNumber: number = Math.floor(Math.random() * (max - min + 1)) + min;
        return randomNumber;
    }

    createRandomText(length: number): string {
        const characters: string = 'abcdefghijklmnopqrstuvwxyz';

        let result: string = '';
        const charactersLength: number = characters.length;

        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }

    extractImageNameFromPresignedUrl(presigned_url: string): string | false {
        try {
            const newUrl = url.parse(presigned_url, true)
            console.log("Presigned url");
            console.log(presigned_url);

            if (newUrl.pathname) {
                const pathName = newUrl.pathname.split("/")
                const path = `${pathName[1]}/${pathName[2]}`
                return path
            } else {
                return false
            }
        } catch (e) {
            return false
        }
    }

    generateFundRaiserTitle(profile: IFundRaise): string {
        return `${profile.full_name}'s Fund Raiser for ${profile.category} in ${profile.district}`
    }

    formatDateToMonthNameAndDate(date: Date): string {
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


    convertFundIdToBeneficiaryId(fund_id: string) {
        return fund_id.replaceAll("-", "_")
    }

    async bufferFromImage(image: string) {
        try {
            const imageRequest = await axios.get(image, { responseType: "arraybuffer" })
            return imageRequest.data
        } catch (e) {
            return null
        }
    }


    async createFundRaiserReport() {




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

    }
}


export default UtilHelper
