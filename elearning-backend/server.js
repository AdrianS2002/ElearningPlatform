require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const usersCourseRoutes = require("./routes/usersCourseRoutes");
const enrollRoutes = require("./routes/enrollRoutes");
const cors = require("cors");


const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:4200", // Permite cereri doar de la frontend-ul Angular
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));

connectDB();

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/courses", courseRoutes);
app.use("/users-courses", usersCourseRoutes);
app.use("/enrollments", enrollRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
