const jwt = require("jsonwebtoken");
const JWT_SECRET = "123456";

exports.auth = (req, res, next) => {
    try {
        // Get the token from the Authorization header
        const token = req.headers.authorization?.split(" ")[1]; // Split to get the token

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing"
            });
        }

        // Verify the token
        try {
            const decode = jwt.verify(token, JWT_SECRET);

            console.log(decode);

            req.user = decode; // Attach user info to the request object
        } catch (e) {
            return res.status(401).json({
                success: false,
                message: "Token is invalid"
            });
        }

        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.log(err);
        return res.status(401).json({
            success: false,
            message: "Something went wrong while verifying token"
        });
    }
};
