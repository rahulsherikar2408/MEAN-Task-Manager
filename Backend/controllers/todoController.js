import Todo from "../models/Todo.js";

export const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({user: req.user._id}).sort({ createdAt: -1 });
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const addTodo = async(req, res) => {
    try {
        const { title, priority, dueDate } = req.body;

        if (!title || title.trim() === "") {
            return res.status(400).json({
                message: "Title is required."
            });
        }

        const todo = await Todo.create({
            title: title.trim(),
            priority,
            dueDate,
            completed: false,
            user: req.user._id
        });
        
        res.status(200).json(todo);
    } 
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateTodo = async(req, res) => {
    try {
        const id = req.params.id;
        const newTodo = req.body;
        const { title } = req.body;

        if (title !== undefined && title.trim() === "") {
            return res.status(400).json({
                message: "Title cannot be empty."
            });
        }

        const updatedTodo = await Todo.findOneAndUpdate(
            { 
                _id: id,
                user: req.user._id
            },
            newTodo,
            {new: true, runValidators: true}
        );

        if (!updatedTodo) {
            return res.status(404).json({
                message: "Todo not found."
            });
        }

        res.status(200).json(updatedTodo);
    } 
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteTodo = async(req, res) => {
    try {
        const id = req.params.id;
        const todo = await Todo.findOneAndDelete({ 
                _id: id
        });
        
        if (!todo) {
            return res.status(404).json({
                message: "Todo not found."
            });
        }

        res.status(200).json({ message: "Todo Deleted" });
    } 
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}