import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.models.js"; 

const authorize = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) return res.status(401).json({ success: false, message: "Unauthorized access" });

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        req.user = user; // Attach user to request object
        next(); // Proceed to the next middleware or route handler
    }catch(error) {
        return res.status(401).json({ success: false, message: "Unauthorized", error: error.message });
    }
}

export default authorize;