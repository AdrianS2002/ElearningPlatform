const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tel: { type: String },
    role: { type: String, enum: ["STUDENT", "PROFESOR"], required: true },
});

// Hash-uiește parola înainte de salvare
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    console.log("+++++++++++++++", this.password);
    next();
});

// Compară parola
UserSchema.methods.validPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};


module.exports = mongoose.model("User", UserSchema);
