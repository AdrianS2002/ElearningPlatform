const enrollRepository = require("../repository/enrollRepository");
const userRepository = require("../repository/userRepository");
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
        const student = await userRepository.findById(enrollData.student_id);
        
        if (!student) {
            throw new Error("Student not found!");
        }

        if (student.role !== "STUDENT") {
            throw new Error("Only students can enroll in courses!");
        }
        return await enrollRepository.enrollStudent(enrollData);
    }

    async removeEnrollment(courseId, studentId) {
        return await enrollRepository.deleteEnrollment(courseId, studentId);
    }
    
}

module.exports = new EnrollService();
