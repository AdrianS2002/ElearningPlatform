const usersCourseRepository = require("../repository/usersCourseRepository");
const userRepository = require("../repository/userRepository");
const courseRepository = require("../repository/courseRepository");

class UsersCourseService {
    async getAllUserCourses() {
        return await usersCourseRepository.findAll();
    }

    async getUserCoursesByUserId(userId) {
        return await usersCourseRepository.findByUserId(userId);
    }

    async getUserCoursesByCourseId(courseId) {
        return await usersCourseRepository.findByCourseId(courseId);
    }

    async assignUserToCourse(userCourseData) {
        const user = await userRepository.findById(userCourseData.user_id);
        if (!user) {
            throw new Error("User not found!");
        }

        if (user.role !== "PROFESOR") {
            throw new Error("Only professors can be assigned to courses!");
        }

        return await usersCourseRepository.create(userCourseData);
    }

    async removeUserFromCourse(id) {
        const userCourse = await usersCourseRepository.findById(id);
        if (!userCourse) {
            throw new Error("User-Course relation not found!");
        }

        return await usersCourseRepository.delete(id);
    }
}

module.exports = new UsersCourseService();
