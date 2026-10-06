import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required."],
            trim: true,
            minlength: [3, "Title must contain at least 3 characters."],
            maxlength: [100, "Title cannot exceed 100 characters."]
        },

        description: {
            type: String,
            trim: true,
            maxlength: [1000, "Description cannot exceed 1000 characters."],
            default: ""
        },

        status: {
            type: String,
            enum: ["TODO", "IN_PROGRESS", "COMPLETED"],
            default: "TODO"
        },

        priority: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
            default: "MEDIUM"
        },

        dueDate: {
            type: Date,
            default: null
        },

        category: {
            type: String,
            trim: true,
            default: "Other"
        },

        tags: {
            type: [String],
            default: []
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        }
    },
    {
        timestamps: true
    }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;