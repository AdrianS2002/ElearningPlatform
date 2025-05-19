const userRepository = require("../repository/userRepository");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

class AuthService {
    // LOGIN
    async login(email, password) {
        const user = await userRepository.findByEmail(email);
        if (!user) throw new Error("User not found. Please check your email or sign up.");

        if (!(await bcrypt.compare(password, user.password))) {
            throw new Error("Incorrect password.");
        }

        return user;
    }

    async signup(userData) {
        const existingUser = await userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error("Email already in use");
        }

       
     //   userData.password = await bcrypt.hash(userData.password, 10);
        return await userRepository.create(userData);
    }

    async logout(req) {
        return new Promise((resolve, reject) => {
            if (!req.session.user) {
                return reject(new Error("User is not logged in"));
            }

            req.session.destroy((err) => {
                if (err) {
                    console.error(" Error destroying session:", err);
                    return reject(new Error("Logout failed"));
                }

                resolve({ message: "Logout successful" });
            });
        });
    }
}

module.exports = new AuthService();
