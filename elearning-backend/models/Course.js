const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    domain: { type: String },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    no_session: { type: Number },
    price: { type: Number, required: true },
    slots: { type: Number, required: true },
    available_slots: { type: Number, required: true },
    languages: { type: [String]},
    discount: { type: Number, default: 0 },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // The professor who owns the course
});

module.exports = mongoose.model("Course", CourseSchema);
