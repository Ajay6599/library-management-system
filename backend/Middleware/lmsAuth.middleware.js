const jwt = require('jsonwebtoken');
const { blacklists } = require('../blacklists');

let lmsAuthMiddleware = {
    authT: (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ msg: "Unauthorized: Invalid token format" });
        }

        const token = authHeader.split(' ')[1];
        console.log(token);

        try {

            if (blacklists.includes(token)) {
                return res.status(401).send({ msg: "You're logged out, Please login" });
            };

            jwt.verify(token, "libManSys", (err, decoded) => {

                if (err) {
                    return res.status(401).send({ msg: "Invalid token" });
                };

                console.log(decoded);
                req.userAuth = decoded;
                next();
            })
        } catch (error) {
            return res.status(400).send({ msg: "Something went wrong while varifying the token", error: error });
        }
    },
    authR: (roles) => {
        return (req, res, next) => {
            if (roles.includes(req.userAuth.role)) {
                next();
            } else {
                return res.status(403).send({ msg: "You're not authorized person to access this resource" })
            }
        }
    }
};

module.exports = { lmsAuthMiddleware };