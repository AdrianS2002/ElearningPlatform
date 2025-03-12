const userRepository = require("../repository/userRepository");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

class AuthService {
    // LOGIN
    async login(email, password) {
        const user = await userRepository.findByEmail(email);
        console.log("User found:", user);
        console.log("Password entered:", password);
        console.log("Stored password (hashed):", user.password);

        if (!user || !(await user.validPassword(password))) {
            throw new Error("Invalid credentials");
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        return { token, user };
    }

    // SIGNUP
    async signup(userData) {
        const existingUser = await userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error("Email already in use");
        }

        // NU hash-uim parola aici, lăsăm `User.js` să facă hash-ul
        const newUser = await userRepository.create(userData);

        const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        return { token, user: newUser };
    }

    // LOGOUT - Adaugă token-ul în blacklist
    async logout(token) {
        if (!token) {
            throw new Error("Token is required for logout");
        }
        blacklistedTokens.add(token); // Stocăm token-ul invalidat
        return { message: "Logout successful" };
    }

    // Verifică dacă un token este invalid
    isTokenBlacklisted(token) {
        return blacklistedTokens.has(token);
    }

}

module.exports = new AuthService();
