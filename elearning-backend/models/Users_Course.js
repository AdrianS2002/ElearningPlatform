const mongoose = require("mongoose");

const UsersCourseSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courses_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
});

module.exports = mongoose.model("Users_Course", UsersCourseSchema);
