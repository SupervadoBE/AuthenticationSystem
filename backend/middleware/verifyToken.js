import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token
    if(!token) {
        return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded || !decoded.userId) {
            return res.status(401).json({ success: false, message: "Invalid token." });
        }
        req.userId = decoded.userId; // Attach user ID to the request object for use in subsequent middleware or route handlers
        next();    
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(401).json({ success: false, message: "Invalid token." });
    }
}