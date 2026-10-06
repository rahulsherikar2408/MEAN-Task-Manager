import mongoose from "mongoose";

const todoSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        default: true,
    },
    dueDate: {
        type: String
    },
    completed: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;