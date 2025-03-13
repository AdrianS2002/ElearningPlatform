const jwt = require("jsonwebtoken");
require("dotenv").config();
const userRepository = require("../repository/userRepository");

// Blacklist for invalidated tokens (if needed)
const blacklistedTokens = new Set();

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log("🔹 Request received. Authorization Header:", authHeader);

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.log("❌ No valid token found.");
            return res.status(401).json({ error: "Unauthorized - Missing token" });
        }

        const token = authHeader.split(" ")[1];
        console.log("🔹 Extracted Token:", token);

        if (blacklistedTokens.has(token)) {
            console.log("❌ Token is blacklisted.");
            return res.status(401).json({ error: "Token has been logged out" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token Decoded:", decoded);

        // Fetch user from DB
        const user = await userRepository.findById(decoded.userId);
        if (!user) {
            console.log("❌ User not found in database.");
            return res.status(401).json({ error: "Invalid user" });
        }

        console.log("✅ Authenticated User:", user.email, "| Role:", user.role);
        req.user = user;
        next();
    } catch (error) {
        console.log("❌ Authentication Error:", error.message);
        res.status(401).json({ error: "Invalid token" });
    }
};

module.exports = { authMiddleware, blacklistedTokens };
