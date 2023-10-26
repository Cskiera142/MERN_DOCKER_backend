require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./config/dbConn");
const { logger, logEvents } = require("./middleware/logger");
const rootRoutes = require("./routes/root");
const taskRoutes = require("./routes/taskRoutes.js");

const app = express();
const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV);

app.use(cors());
app.use(logger);
app.use(express.json());
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/", rootRoutes);
app.use("/taskRoutes", taskRoutes);
app.use("/taskRoutes/:id", taskRoutes);
app.use(errorHandler);

connectDB();

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
