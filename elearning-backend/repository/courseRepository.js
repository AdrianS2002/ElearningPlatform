const Course = require("../models/Course");

class CourseRepository {
    async findAll() {
        return await Course.find().populate("user_id", "email role");
    }

    async findById(id) {
        return await Course.findById(id).populate("user_id", "email role");
    }

    async create(courseData) {
        const course = new Course(courseData);
        return await course.save();
    }

    async update(id, courseData) {
        return await Course.findByIdAndUpdate(id, courseData, { new: true });
    }

    async delete(id) {
        return await Course.findByIdAndDelete(id);
    }

    async findByProfessor(professorId) {
        return await Course.find({ user_id: professorId });
    }
}

module.exports = new CourseRepository();
