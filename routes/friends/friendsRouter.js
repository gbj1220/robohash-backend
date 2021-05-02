const express = require("express");
const router = express.Router();

const {
  createFriends,
  getFriendsList,
} = require("./controller/friendsController");

router.get("/get-friends-list", getFriendsList);

router.post("/create-friend", createFriends);

module.exports = router;
