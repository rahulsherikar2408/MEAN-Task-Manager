import "dotenv/config";

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();

// Connection to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_API_URL
}));
app.use(express.json());

// Todo Routes
app.use("/api/tasks", taskRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get('/', (req, res) => {
    res.send("Todo API Running");
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server Running at PORT: ${PORT}`);
});