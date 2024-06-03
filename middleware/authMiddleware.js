

let authMiddleware = {

    isValidUser: (req, res, next) => {
        next()
    },

    isValidAdmin: (req, res, next) => {
        next()
    }
}

module.exports = authMiddleware