const express = require("express");
const userService = require("../services/userService");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const users = await userService.getUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(404).json({ error: "User not found" });
    }
});

router.post("/", async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        await userService.updateUser(req.params.id, req.body);
        res.json({ message: "User updated!" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await userService.deleteUser(req.params.id);
        res.json({ message: "User deleted!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
