const mongoose = require("mongoose");

const FriendsListSchema = new mongoose.Schema({
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

  emailAddress: {
    type: String,
    trim: true,
    require: true,
  },
});

module.exports = mongoose.model("newFriendsListItem", FriendsListSchema);
