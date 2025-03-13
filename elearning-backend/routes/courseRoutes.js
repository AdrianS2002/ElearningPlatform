const express = require("express");
const courseService = require("../services/courseService");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();

// Get all courses
router.get("/", async (req, res) => {
    try {
        const courses = await courseService.getCourses();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single course by ID
router.get("/:id", async (req, res) => {
    try {
        const course = await courseService.getCourseById(req.params.id);
        res.json(course);
    } catch (error) {
        res.status(404).json({ error: "Course not found" });
    }
});

// Create a new course
router.post("/", async (req, res) => {
    try {
        const courseData = req.body;  // Extract course data from request body
        const createdCourse = await courseService.createCourse(courseData);
        res.status(201).json(createdCourse);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update a course (only authenticated professors)
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const courseId = req.params.id;
        const professorId = req.user._id; // Extract professor ID from token
        await courseService.updateCourse(courseId, req.body, professorId);
        res.json({ message: "Course updated!" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a course (only authenticated professors)
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const courseId = req.params.id;
        const professorId = req.user._id;
        await courseService.deleteCourse(courseId, professorId);
        res.json({ message: "Course deleted!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
