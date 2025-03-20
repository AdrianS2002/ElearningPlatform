require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const usersCourseRoutes = require("./routes/usersCourseRoutes");
const enrollRoutes = require("./routes/enrollRoutes");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { GoogleGenerativeAI } = require("@google/generative-ai"); 

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:4200",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true
}));


app.use(session({
    secret: process.env.SESSION_SECRET || "securitate_puternica",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: "sessions"
    }),
    cookie: {
        secure: false,
        httpOnly: true, 
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 
    }
}));

connectDB();

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/courses", courseRoutes);
app.use("/users-courses", usersCourseRoutes);
app.use("/enrollments", enrollRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const API_KEY = process.env.GEMINI_API_KEY; 
const genAI = new GoogleGenerativeAI(API_KEY); 
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });


app.post("/api/chatbot", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required" });

        console.log("📤 Sending to AI:", message);
        
        const result = await model.generateContent(message);
        const response = await result.response;

        console.log("🛠️ AI Raw Response:", response);

       
        const reply = response.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I could not understand that.";

        console.log("🤖 AI Reply:", reply);

        res.json({ reply });
    } catch (error) {
        console.error("🔥 AI Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ 
            error: "Internal Server Error",
            details: error.response ? error.response.data : error.message 
        });
    }
});