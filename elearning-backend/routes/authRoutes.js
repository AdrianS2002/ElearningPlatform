const express = require("express");
const authService = require("../services/authService");

const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
        const user = await authService.signup(req.body);

       
        req.session.user = { id: user._id, email: user.email, role: user.role };

        res.status(201).json({ message: "Signup successful", user: req.session.user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Ruta pentru LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await authService.login(email, password);

       
        req.session.user = { id: user._id, email: user.email, role: user.role };

        res.json({ message: "Login successful", user: req.session.user });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

router.get("/session", (req, res) => {
    if (req.session.user) {
        res.json({ 
            message: "Sesiune activă",
            user: req.session.user, 
            role: req.session.user.role
        });
    } else {
        res.status(401).json({ error: "No active session" });
    }
});

router.post("/logout", (req, res) => {
    if (!req.session.user) {
        return res.status(400).json({ error: "User is not logged in" });
    }

    req.session.destroy((err) => {
        if (err) {
            console.error("Logout error:", err);
            return res.status(500).json({ error: "Logout failed" });
        }
        res.clearCookie("connect.sid"); 
        res.json({ message: "Logout successful" });
    });
});

module.exports = router;
