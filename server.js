require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB(); // wait for MongoDB connection

  app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

  } catch (error) {
    console.error("Failed to connect to DB:", error);
    process.exit(1); // exit if DB fails
  }
};

startServer();