import  express from "express";
import Todo from "../models/Todo.js";
import { addTodo, deleteTodo, getTodos, updateTodo } from "../controllers/todoController.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();

router.get('/', authMiddleware, getTodos);

router.post('/', authMiddleware, addTodo);

router.put('/:id', authMiddleware, updateTodo);

router.delete('/:id', authMiddleware, deleteTodo);

export default router;