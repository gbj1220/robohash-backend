const FriendsList = require("../model/FriendsListItems");
const User = require("../../users/model/User");
const jwt = require("jsonwebToken");

module.exports = {
  createFriends: async (req, res) => {
    try {
      const { firstName, lastName, emailAddress } = req.body;

      const friendsList = await new FriendsList({
        firstName,
        lastName,
        emailAddress,
      });

      const newSavedItem = await friendsList.save();

      const token = req.headers.authorization.slice(7);

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      const targetUser = await User.findOne({ email: decodedToken.email });

      targetUser.friends.push(newSavedItem._id);

      await targetUser.save();

      res.json(targetUser);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },

  getFriendsList: async (req, res) => {
    try {
      const jwtToken = req.headers.authorization.slice(7);

      const decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRET);

      const payload = await User.findOne({ email: decodedToken.email })
        .populate({
          path: "friends",
          model: "newFriendsListItem",
          select: "-__v",
        })
        .select("-email -password -firstName -lastName  -__v ");
      res.json(payload);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },
};
