/*import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            })
        }
        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        if(!decode){
            return res.status(401).json({
                message:"Invalid token",
                success:false
            })
        };
        req.id = decode.userId;
        next();
    } catch (error) {
        console.log(error);
    }
}
export default isAuthenticated;*/





/*
import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        console.log("Extracted token:", token);
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            });
        }

        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: "Invalid token",
                    success: false,
                });
            }

            req.id = decoded.userId;
            next();
        });
    } catch (error) {
        console.error("Error in authentication middleware:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export default isAuthenticated;
*/



import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
    try {
        // Extract token from cookies or authorization headers
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        console.log("Extracted token:", token);

        // If token is not present, return a 401 Unauthorized response
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            });
        }

        // Verify token using the secret key
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                console.error("JWT verification error:", err);
                return res.status(401).json({
                    message: "Invalid token",
                    success: false,
                });
            }

            // Attach user ID from decoded token to the request object
            req.id = decoded.userId;
            next();
        });
    } catch (error) {
        console.error("Error in authentication middleware:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export default isAuthenticated;
