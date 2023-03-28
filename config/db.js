const mongoose = require("mongoose");

const url = "mongodb://0.0.0.0:27017";

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection error:", err));

module.exports = mongoose;
