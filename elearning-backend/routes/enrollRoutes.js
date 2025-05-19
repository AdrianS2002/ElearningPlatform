const express = require("express");
const enrollService = require("../services/enrollService");

const router = express.Router();

// Get all enrollments
router.get("/", async (req, res) => {
    try {
        const enrollments = await enrollService.getAllEnrollments();
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get enrollments for a specific student
router.get("/student/:studentId", async (req, res) => {
    try {
        const studentEnrollments = await enrollService.getEnrollmentsByStudentId(req.params.studentId);
        res.json(studentEnrollments);
    } catch (error) {
        res.status(404).json({ error: "Student enrollments not found" });
    }
});

// Get enrollments for a specific course
router.get("/course/:courseId", async (req, res) => {
    try {
        const courseEnrollments = await enrollService.getEnrollmentsByCourseId(req.params.courseId);
        res.json(courseEnrollments);
    } catch (error) {
        res.status(404).json({ error: "Course enrollments not found" });
    }
});

// Enroll a student in a course
router.post("/", async (req, res) => {
    try {
        const enrollment = await enrollService.enrollStudent(req.body);
        res.status(201).json(enrollment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete("/:courseId/:studentId", async (req, res) => {
    try {
        const { courseId, studentId } = req.params;
        await enrollService.removeEnrollment(courseId, studentId);
        res.json({ message: "Student successfully unenrolled from the course!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
