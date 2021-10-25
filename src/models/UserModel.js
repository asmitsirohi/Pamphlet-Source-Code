const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  googleId: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin", "co-admin"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = new mongoose.model("user", userSchema);

module.exports = User;
