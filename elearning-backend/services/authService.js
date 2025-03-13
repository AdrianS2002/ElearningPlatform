const userRepository = require("../repository/userRepository");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

class AuthService {
    // LOGIN
    async login(email, password) {
        const user = await userRepository.findByEmail(email);

        // ✅ Step 1: Check if user exists before accessing its properties
        if (!user) {
            console.log("❌ Login failed: User not found.");
            throw new Error("User not found. Please check your email or sign up.");
        }

        console.log("✅ User found:", user.email);
        console.log("🔹 Password entered:", password);
        console.log("🔹 Stored password (hashed):", user.password);

        // ✅ Step 2: Verify password
        if (!(await user.validPassword(password))) {
            console.log("❌ Invalid Credentials: Incorrect password.");
            throw new Error("Incorrect password. Please try again.");
        }

        // ✅ Step 3: Generate JWT Token
        const token = jwt.sign(
            { userId: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }
        );

        console.log("✅ Login successful! Token generated.");

        return { token, user };
    }

    // SIGNUP
    async signup(userData) {
        const existingUser = await userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error("Email already in use");
        }

        const newUser = await userRepository.create(userData);
        const token = jwt.sign(
            { userId: newUser._id, role: newUser.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }
        );

        return { token, user: newUser };
    }

    // LOGOUT - Adaugă token-ul în blacklist
    async logout(token) {
        if (!token) {
            throw new Error("Token is required for logout");
        }
        blacklistedTokens.add(token);
        return { message: "Logout successful" };
    }

    isTokenBlacklisted(token) {
        return blacklistedTokens.has(token);
    }
}

module.exports = new AuthService();
