import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import { connectDB } from "./db/connectDB.js";

import authRoutes from "./routes/auth.route.js";

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve()

app.use(cors({
    origin: "http://localhost:5173", // Allow requests from the frontend
    credentials: true, // Allow cookies to be sent with requests
})); // Enable CORS for the frontend domain

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies

app.use("/api/auth", authRoutes); // Use auth routes for authentication-related endpoints

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")))

    app.get("*all", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
    })
}

app.listen(PORT, () => {
    connectDB(); // Connect to the database when the server starts
    console.log(`Server is running on port ${PORT}`);
});