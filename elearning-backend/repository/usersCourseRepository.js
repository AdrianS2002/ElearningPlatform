const UsersCourse = require("../models/Users_Course");

class UsersCourseRepository {
    async findAll() {
        return await UsersCourse.find().populate("user_id").populate("courses_id");
    }

    async findByUserId(userId) {
        return await UsersCourse.find({ user_id: userId }).populate("courses_id");
    }

    async findByCourseId(courseId) {
        return await UsersCourse.find({ courses_id: courseId }).populate("user_id");
    }

    async create(usersCourseData) {
        const usersCourse = new UsersCourse(usersCourseData);
        return await usersCourse.save();
    }

    async deleteByCourseId(courseId) {
        return await UsersCourse.deleteMany({ courses_id: courseId });
    }

    async delete(id) {
        return await UsersCourse.findByIdAndDelete(id);
    }
}

module.exports = new UsersCourseRepository();
