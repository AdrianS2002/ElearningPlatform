require("dotenv").config();
const userRepository = require("../repository/userRepository");

const authMiddleware = async (req, res, next) => {
    try {
        console.log("🔹 Checking session authentication:", req.session);

      
        if (!req.session || !req.session.user) {
            console.log(" Unauthorized access - No active session found");
            return res.status(401).json({ error: "Unauthorized - No active session" });
        }

        console.log(" Session User Found:", req.session.user);

       
        const user = await userRepository.findById(req.session.user.id);
        if (!user) {
            console.log(" User not found in database.");
            return res.status(401).json({ error: "Unauthorized - User not found" });
        }

        console.log(" Authenticated User:", user.email, "| Role:", user.role);

        
        req.user = user;
        next();
    } catch (error) {
        console.log(" Authentication Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { authMiddleware };
