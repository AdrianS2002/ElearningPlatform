const courseRepository = require("../repository/courseRepository");
const userRepository = require("../repository/userRepository");
const usersCourseRepository = require("../repository/usersCourseRepository");

class CourseService {
    async getCourses() {
        return await courseRepository.findAll();
    }

    async getCourseById(id) {
        return await courseRepository.findById(id);
    }

    async createCourse(courseData) {
        const professor = await userRepository.findById(courseData.user_id);
        if (!professor) {
            throw new Error("User not found!");
        }

        if (professor.role !== "PROFESOR") {
            throw new Error("Only professors can create courses!");
        }
        courseData.available_slots = courseData.slots;

       // courseData.user_id = professor._id;
        const newCourse = await courseRepository.create(courseData);
        await usersCourseRepository.create({
            user_id: courseData.user_id,
            courses_id: newCourse._id
        });

        return newCourse;
    }

    async updateCourse(id, courseData, userId) {
        console.log(`🔹 Updating Course ID: ${id} | Requested by User ID: ${userId}`);
    
        const professor = await userRepository.findById(userId);
        if (!professor || professor.role !== "PROFESOR") {
            console.log("❌ Unauthorized: Only professors can edit courses.");
            throw new Error("Only professors can edit courses!");
        }
    
        const course = await courseRepository.findById(id);
        if (!course) {
            console.log("❌ Course not found.");
            throw new Error("Course not found!");
        }
    
        console.log(`✅ Course found: ${course.name} | Owned by: ${course.user_id}`);
        console.log(`🔹 Comparing owner (${course.user_id.toString()}) with requester (${userId})`);
    
        if (course.user_id._id.toString() !== userId.toString()) {
            console.log(`❌ Unauthorized: Course owner is ${course.user_id}, but request came from ${userId}`);
            throw new Error("You can only edit your own courses!");
        }

        if (courseData.slots !== undefined && courseData.slots !== course.slots) {
            const difference = courseData.slots - course.slots;
            courseData.available_slots = course.available_slots + difference;
        }
    
        console.log("✅ Course update authorized. Proceeding...");
        return await courseRepository.update(id, courseData);
    }
    

    async deleteCourse(id, userId) {
        const professor = await userRepository.findById(userId);
        if (!professor || professor.role !== "PROFESOR") {
            throw new Error("Only professors can delete courses!");
        }

        const course = await courseRepository.findById(id);
        if (!course) {
            throw new Error("Course not found!");
        }

        if (course.user_id._id.toString() !== userId.toString()) {
            throw new Error("You can only delete your own courses!");
        }

        await courseRepository.delete(id);
        await usersCourseRepository.deleteByCourseId(id);

        return { message: "Course deleted successfully!" };
    }
}

module.exports = new CourseService();
