const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const userRoutes = require("./routes/user.routes.js");
const roleRoutes = require("./routes/role.routes.js");
const subjectRoutes = require("./routes/subject.routes.js");
const topicRoutes = require("./routes/topic.routes.js");
const descriptiveRoutes = require("./routes/descriptive.routes.js");
const mcqRoutes = require("./routes/mcq.routes.js");
const descriptiveExamRoutes = require("./routes/descriptiveExams.routes.js");
const mcqExamRoutes = require("./routes/mcqExams.routes.js");
const notificationRoutes = require("./routes/notification.routes.js");
const authRoutes = require("./routes/auth.routes.js");
const analyticsRoutes = require("./routes/analytics.routes.js");
const authMiddleware = require("./middleware/authMiddleware.js");
require("dotenv").config();

const app = express();

const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully");

    app.use(express.json());
    app.use(
      cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
      })
    );

    app.use("/auth", authRoutes);

    app.use(authMiddleware);

    app.use("/users", userRoutes);
    app.use("/roles", roleRoutes);
    app.use("/subjects", subjectRoutes);
    app.use("/topics", topicRoutes);
    app.use("/descriptives", descriptiveRoutes);
    app.use("/mcqs", mcqRoutes);
    app.use("/descriptiveExams", descriptiveExamRoutes);
    app.use("/mcqExams", mcqExamRoutes);
    app.use("/notifications", notificationRoutes);
    app.use("/analytics", analyticsRoutes);

    app.get("/", (req, res) => {
      res.send("Hello! Welcome to the Virtual Question Bank System.");
    });

    const port = process.env.PORT || 3000;
    console.log("Port: ", process.env.PORT);

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
};

startServer();
