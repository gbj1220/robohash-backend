const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: true,
  },
  lastName: {
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

  friends: [{ type: mongoose.Schema.ObjectId, ref: "friend" }],
});

module.exports = mongoose.model("user", UserSchema);
