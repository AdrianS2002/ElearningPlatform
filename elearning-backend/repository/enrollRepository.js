const Enroll = require("../models/Enroll");

class EnrollRepository {
    async findAll() {
        return await Enroll.find().populate("student_id", "email").populate("courses_id", "name");
    }

    async findByStudentId(studentId) {
        return await Enroll.find({ student_id: studentId }).populate("courses_id");
    }

    async findByCourseId(courseId) {
        return await Enroll.find({ courses_id: courseId }).populate("student_id");
    }

    async enrollStudent(enrollmentData) {
        const enrollment = new Enroll(enrollmentData);
        return await enrollment.save();
    }

    async deleteByCourseId(courseId) {
        return await Enroll.deleteMany({ courses_id: courseId });
    }

    async deleteEnrollment(courseId, studentId) {
        return await Enroll.findOneAndDelete({ courses_id: courseId, student_id: studentId });
    }
    
    

    async delete(id) {
        return await Enroll.findByIdAndDelete(id);
    }
}

module.exports = new EnrollRepository();
