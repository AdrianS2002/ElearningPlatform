const express = require("express");
const authService = require("../services/authService");

const router = express.Router();

// Ruta pentru SIGNUP (înregistrare)
router.post("/signup", async (req, res) => {
    try {
        const { token, user } = await authService.signup(req.body);
        res.status(201).json({ token, user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Ruta pentru LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const { token, user } = await authService.login(email, password);
        res.json({ token, user });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

// Logout route
router.post("/logout", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extrage token-ul din header-ul "Authorization"

    if (!token) {
        return res.status(400).json({ error: "Token is required for logout" });
    }

    try {
        authService.logout(token);
        res.json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
