const fundRaisingHelper = require("../util/helper/fundRaiserHelper");


let adminController = {

    getSingleProfile: async (req, res) => {
        try {
            let profile_id = req.params.profile_id;
            let profile = await fundRaisingHelper.getSingleFundRaise(profile_id);
            if (profile) {
                res.status(200).json({ status: true, data: profile })
            } else {
                res.status(204).json({ status: false, msg: "No profile found" })
            }
        } catch (e) {
            console.log(e);
            res.status(500).json({ status: false, msg: "Internal server error" })
        }
    }
}

module.exports = adminController;