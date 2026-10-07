import Task from "../models/Task.js";

/*
    GET /api/tasks
    Get all tasks belonging to logged-in user
*/

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const getTasks = async (req, res) => {
  try {
    const {
      search,
      status,
      priority,
      category,
      dueFrom,
      dueTo,
      overdue,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 10
    } = req.query;

    const filter = {
      user: req.user._id
    };

    // =========================
    // Search
    // =========================

    if (search && search.trim()) {
      const escapedSearch = search
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const searchRegex = new RegExp(escapedSearch, "i");

      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { tags: searchRegex }
      ];
    }

    // =========================
    // Status
    // =========================

    if (
      status &&
      ["TODO", "IN_PROGRESS", "COMPLETED"].includes(status)
    ) {
      filter.status = status;
    }

    // =========================
    // Priority
    // =========================

    if (
      priority &&
      ["LOW", "MEDIUM", "HIGH", "URGENT"].includes(priority)
    ) {
      filter.priority = priority;
    }

    // =========================
    // Category
    // =========================

    if (category && category !== "All") {
      filter.category = category;
    }

    // =========================
    // Due Date From
    // =========================

    if (dueFrom) {
      const startDate = new Date(dueFrom);

      if (!isNaN(startDate.getTime())) {
        startDate.setHours(0, 0, 0, 0);

        filter.dueDate = {
          ...filter.dueDate,
          $gte: startDate
        };
      }
    }

    // =========================
    // Due Date To
    // =========================

    if (dueTo) {
      const endDate = new Date(dueTo);

      if (!isNaN(endDate.getTime())) {
        endDate.setHours(23, 59, 59, 999);

        filter.dueDate = {
          ...filter.dueDate,
          $lte: endDate
        };
      }
    }

    // =========================
    // Overdue
    // =========================

    if (overdue === "true") {
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      filter.dueDate = {
        ...filter.dueDate,
        $lt: today
      };

      filter.status = {
        $ne: "COMPLETED"
      };
    }

    // =========================
    // Sorting
    // =========================

    const allowedSortFields = [
      "createdAt",
      "updatedAt",
      "dueDate",
      "title",
      "priority",
      "status"
    ];

    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

    const safeSortOrder = sortOrder === "asc" ? 1 : -1;

    const sort = {
      [safeSortBy]: safeSortOrder
    };

    // =========================
    // Pagination
    // =========================

    const pageNumber = Math.max(parseInt(page) || 1, 1);

    const limitNumber = Math.min(
      Math.max(parseInt(limit) || 10, 1),
      100
    );

    const skip = (pageNumber - 1) * limitNumber;

    // =========================
    // Total Tasks
    // =========================

    const totalTasks = await Task.countDocuments(filter);

    const totalPages = Math.ceil(
      totalTasks / limitNumber
    );

    // =========================
    // Fetch Tasks
    // =========================

    const tasks = await Task.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNumber);

    // =========================
    // Response
    // =========================

    res.status(200).json({
      tasks,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        totalTasks,
        totalPages
      }
    });

  } catch (error) {
    console.error("Get Tasks Error:", error);

    res.status(500).json({
      message: "Unable to fetch tasks."
    });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/*
    POST /api/tasks
    Create a new task
*/
export const addTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, category, tags } = req.body;

    // Validate title
    if (!title || title.trim() === "") {
      return res.status(400).json({
        message: "Title is required.",
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
      user: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
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

    const { title, description, status, priority, dueDate, category, tags } =
      req.body;

    // Validate title if provided
    if (title !== undefined && title.trim() === "") {
      return res.status(400).json({
        message: "Title cannot be empty.",
      });
    }

    const updatedTask = await Task.findOneAndUpdate(
      {
        _id: id,
        user: req.user._id,
      },
      {
        ...(title !== undefined && {
          title: title.trim(),
        }),

        ...(description !== undefined && {
          description: description.trim(),
        }),

        ...(status !== undefined && {
          status,
        }),

        ...(priority !== undefined && {
          priority,
        }),

        ...(dueDate !== undefined && {
          dueDate: dueDate || null,
        }),

        ...(category !== undefined && {
          category: category.trim(),
        }),

        ...(tags !== undefined && {
          tags,
        }),
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({
      message: error.message,
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
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
