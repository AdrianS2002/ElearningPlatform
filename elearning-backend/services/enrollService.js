const enrollRepository = require("../repository/enrollRepository");
const userRepository = require("../repository/userRepository");
const courseRepository = require("../repository/courseRepository");
const Enroll = require("../models/Enroll"); 
class EnrollService {
    async getAllEnrollments() {
        return await enrollRepository.findAll();
    }

    async getEnrollmentsByStudentId(studentId) {
        return await enrollRepository.findByStudentId(studentId);
    }

    async getEnrollmentsByCourseId(courseId) {
        return await enrollRepository.findByCourseId(courseId);
    }

    async enrollStudent(enrollData) {
        console.log("🔍 Attempting to enroll Student: ${enrollData.student_id} in Course: ${enrollData.courses_id}");

        const student = await userRepository.findById(enrollData.student_id);
        if (!student) {
            throw new Error("Student not found!");
        }

        if (student.role !== "STUDENT") {
            throw new Error("Only students can enroll in courses!");
        }

        const course = await courseRepository.findById(enrollData.courses_id);
        if (!course) {
            throw new Error("Course not found!");
        }

        if (course.available_slots <= 0) {
            console.log("❌ No available slots left for this course!");
            throw new Error("No available slots left for this course!");
        }

        // ✅ Verificăm dacă studentul este deja înscris
        const existingEnrollment = await enrollRepository.findByStudentAndCourse(enrollData.student_id, enrollData.courses_id);
        if (existingEnrollment) {
            console.log("⚠️ Student is already enrolled in this course!");
            throw new Error("Student is already enrolled in this course!");
        }

        // ✅ Scădem numărul de locuri disponibile
        await courseRepository.update(course._id, { available_slots: course.available_slots - 1 });

        // ✅ Salvăm enroll-ul și îl returnăm populat
        const enrollment = await enrollRepository.enrollStudent(enrollData);
        return await Enroll.findById(enrollment._id).populate("courses_id");
    }

    async removeEnrollment(courseId, studentId) {
        console.log("🔍 Attempting to remove enrollment for Course: ${courseId}, Student: ${studentId}");

        try {
            const course = await courseRepository.findById(courseId);
            if (!course) {
                console.log("❌ Course not found!");
                throw new Error("Course not found!");
            }

            const enrollment = await enrollRepository.deleteEnrollment(courseId, studentId);
            if (!enrollment) {
                console.log("⚠️ Student is not enrolled in this course!");
                throw new Error("Enrollment not found!");
            }

            console.log("✅ Enrollment deleted, updating available slots for Course: ${courseId}");

            await courseRepository.update(course._id, {
                available_slots: course.available_slots + 1,
            });

            console.log("✅ Course ${courseId} now has ${course.available_slots + 1} available slots");

            return { message: "Enrollment removed successfully!" };
        } catch (error) {
            console.error("❌ Error in removeEnrollment:", error);
            throw error;
        }
    }


}
module.exports = new EnrollService();