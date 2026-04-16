const express = require("express");
const cors = require("cors");
const profileRoutes = require("./routes/profileRoutes");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// ADD THIS
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.use("/api/profiles", profileRoutes);

module.exports = app;