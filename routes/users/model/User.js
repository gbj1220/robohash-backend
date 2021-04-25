const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userCreated: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("user", UserSchema);
