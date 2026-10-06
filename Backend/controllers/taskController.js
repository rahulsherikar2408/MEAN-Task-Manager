import Task from "../models/Task.js";

/*
    GET /api/tasks
    Get all tasks belonging to logged-in user
*/
export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({
            user: req.user._id
        }).sort({ createdAt: -1 });

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


/*
    POST /api/tasks
    Create a new task
*/
export const addTask = async (req, res) => {
    try {
        const {
            title,
            description,
            status,
            priority,
            dueDate,
            category,
            tags
        } = req.body;

        // Validate title
        if (!title || title.trim() === "") {
            return res.status(400).json({
                message: "Title is required."
            });
        }

        const task = await Task.create({
            title: title.trim(),
            description: description?.trim() || "",
            status: status || "TODO",
            priority: priority || "MEDIUM",
            dueDate: dueDate || null,
            category: category?.trim() || "Other",
            tags: tags || [],
            user: req.user._id
        });

        res.status(201).json(task);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


/*
    PUT /api/tasks/:id
    Update a task belonging to logged-in user
*/
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            title,
            description,
            status,
            priority,
            dueDate,
            category,
            tags
        } = req.body;

        // Validate title if provided
        if (title !== undefined && title.trim() === "") {
            return res.status(400).json({
                message: "Title cannot be empty."
            });
        }

        const updatedTask = await Task.findOneAndUpdate(
            {
                _id: id,
                user: req.user._id
            },
            {
                ...(title !== undefined && {
                    title: title.trim()
                }),

                ...(description !== undefined && {
                    description: description.trim()
                }),

                ...(status !== undefined && {
                    status
                }),

                ...(priority !== undefined && {
                    priority
                }),

                ...(dueDate !== undefined && {
                    dueDate: dueDate || null
                }),

                ...(category !== undefined && {
                    category: category.trim()
                }),

                ...(tags !== undefined && {
                    tags
                })
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedTask) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        res.status(200).json(updatedTask);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


/*
    DELETE /api/tasks/:id
    Delete a task belonging to logged-in user
*/
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findOneAndDelete({
            _id: id,
            user: req.user._id
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        res.status(200).json({
            message: "Task deleted successfully."
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};