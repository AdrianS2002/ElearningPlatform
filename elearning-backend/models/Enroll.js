const mongoose = require("mongoose");

const EnrollSchema = new mongoose.Schema({
    courses_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    enrollment_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Enroll", EnrollSchema);
