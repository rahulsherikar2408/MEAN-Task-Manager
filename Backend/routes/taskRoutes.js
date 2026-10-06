import express from "express";

import {
    addTask,
    deleteTask,
    getTasks,
    updateTask
} from "../controllers/taskController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// GET /api/tasks
router.get("/", authMiddleware, getTasks);


// POST /api/tasks
router.post("/", authMiddleware, addTask);


// PUT /api/tasks/:id
router.put("/:id", authMiddleware, updateTask);


// DELETE /api/tasks/:id
router.delete("/:id", authMiddleware, deleteTask);


export default router;