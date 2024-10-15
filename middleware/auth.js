const jwt = require('jsonwebtoken');
const JWT_SECRET = "123456";

exports.auth = (req, res, next) => {
    try {
        const token = req?.cookie?.token || req.header("Authorization").replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "token missing"
            })
        }

        // verify the token 
        try {
            const decode = jwt.verify(token, JWT_SECRET);
            req.admin = decode.role;
            req.email = decode.email;
            req.id = decode.id;
        }
        catch (error) {
            return res.status(401).json({
                success: false,
                message: "token is invalid"
            })
        }

        next();
    }
    catch (err) {
        console.log(err)
        return res.status(401).json({
            success: false,
            message: "Something went wrong while verifying token"
        })
    }
}