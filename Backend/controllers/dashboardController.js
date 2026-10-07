import Task from "../models/Task.js";

export const getDashboard = async (req, res) => {
    try {
        const userId = req.user._id;

        const tasks = await Task.find({
            user: userId
        }).sort({
            createdAt: -1
        });

        const today = new Date();

        today.setHours(0, 0, 0, 0);


        const tomorrow = new Date(today);

        tomorrow.setDate(
            tomorrow.getDate() + 1
        );


        const total = tasks.length;


        const todo = tasks.filter(
            task => task.status === "TODO"
        ).length;


        const inProgress = tasks.filter(
            task => task.status === "IN_PROGRESS"
        ).length;


        const completed = tasks.filter(
            task => task.status === "COMPLETED"
        ).length;


        const overdue = tasks.filter(task => {

            if (
                !task.dueDate ||
                task.status === "COMPLETED"
            ) {
                return false;
            }

            const dueDate =
                new Date(task.dueDate);

            dueDate.setHours(0, 0, 0, 0);

            return dueDate < today;

        }).length;


        const dueToday = tasks.filter(task => {

            if (
                !task.dueDate ||
                task.status === "COMPLETED"
            ) {
                return false;
            }

            const dueDate =
                new Date(task.dueDate);

            dueDate.setHours(0, 0, 0, 0);

            return (
                dueDate.getTime() ===
                today.getTime()
            );

        }).length;


        const upcoming = tasks.filter(task => {

            if (
                !task.dueDate ||
                task.status === "COMPLETED"
            ) {
                return false;
            }

            const dueDate =
                new Date(task.dueDate);

            dueDate.setHours(0, 0, 0, 0);

            return dueDate >= tomorrow;

        }).length;


        const highPriority = tasks.filter(
            task =>
                task.priority === "HIGH" &&
                task.status !== "COMPLETED"
        ).length;


        const urgentPriority = tasks.filter(
            task =>
                task.priority === "URGENT" &&
                task.status !== "COMPLETED"
        ).length;


        const recentTasks =
            tasks.slice(0, 5);


        const upcomingTasks =
            tasks
                .filter(task => {

                    if (
                        !task.dueDate ||
                        task.status === "COMPLETED"
                    ) {
                        return false;
                    }

                    const dueDate =
                        new Date(task.dueDate);

                    dueDate.setHours(0, 0, 0, 0);

                    return dueDate >= today;

                })
                .sort(
                    (a, b) =>
                        new Date(a.dueDate).getTime() -
                        new Date(b.dueDate).getTime()
                )
                .slice(0, 5);


        const overdueTasks =
            tasks
                .filter(task => {

                    if (
                        !task.dueDate ||
                        task.status === "COMPLETED"
                    ) {
                        return false;
                    }

                    const dueDate =
                        new Date(task.dueDate);

                    dueDate.setHours(0, 0, 0, 0);

                    return dueDate < today;

                })
                .slice(0, 5);


        res.status(200).json({

            stats: {
                total,
                todo,
                inProgress,
                completed,
                overdue,
                dueToday,
                upcoming,
                highPriority,
                urgentPriority
            },

            recentTasks,

            upcomingTasks,

            overdueTasks

        });

    } catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );

        res.status(500).json({
            message:
                "Unable to load dashboard data."
        });

    }
};