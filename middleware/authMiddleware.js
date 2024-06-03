

let authMiddleware = {

    isValidUser: (req, res, next) => {
        next()
    }
}

authMiddleware();