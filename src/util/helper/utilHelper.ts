

class UtilHelper {


    constractor() {
        this.createFundRaiseID = this.createFundRaiseID.bind(this)
        this.createRandomText = this.createRandomText.bind(this)
        this.generateAnOTP = this.generateAnOTP.bind(this)
    }

    createFundRaiseID(created_by: string): string {
        let createdBY: string = created_by == "USER" ? "U" : (created_by == "ADMIN" ? "A" : "O");

        let fundId: string = this.createRandomText(5) + "-" + created_by + "-" + new Date().getUTCMilliseconds()
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

}


export default UtilHelper

// module.exports = utilHelper;