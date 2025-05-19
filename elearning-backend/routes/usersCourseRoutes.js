const express = require("express");
const usersCourseService = require("../services/UsersCourseService");

const router = express.Router();

// Get all user-course relationships
router.get("/", async (req, res) => {
    try {
        const usersCourses = await usersCourseService.getAllUserCourses();
        res.json(usersCourses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get courses assigned to a specific user
router.get("/user/:userId", async (req, res) => {
    try {
        const userCourses = await usersCourseService.getUserCoursesByUserId(req.params.userId);
        res.json(userCourses);
    } catch (error) {
        res.status(404).json({ error: "User courses not found" });
    }
});

// Get users assigned to a specific course
router.get("/course/:courseId", async (req, res) => {
    try {
        const courseUsers = await usersCourseService.getUserCoursesByCourseId(req.params.courseId);
        res.json(courseUsers);
    } catch (error) {
        res.status(404).json({ error: "Course users not found" });
    }
});

// Assign a user to a course
router.post("/", async (req, res) => {
    try {
        const userCourse = await usersCourseService.assignUserToCourse(req.body);
        res.status(201).json(userCourse);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Remove a user from a course
router.delete("/:id", async (req, res) => {
    try {
        await usersCourseService.removeUserFromCourse(req.params.id);
        res.json({ message: "User removed from course!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
