const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const pathRoutes = require("./routes/pathRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const progressRoutes = require("./routes/progressRoutes");
const platformRoutes = require("./routes/platformRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const messageRoutes = require("./routes/messageRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "backend", "uploads")));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, date: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/paths", pathRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/platforms", platformRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
