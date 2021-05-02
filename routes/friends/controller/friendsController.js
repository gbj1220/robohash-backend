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

      console.log(req.headers.authorization);

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
      let jwtToken = req.headers.authorization.slice(7);

      let decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRET);

      let payload = await User.findOne({ email: decodedToken.email })
        .populate({
          path: "friends",
          model: "newFriendsListItem",
          select: "-__v",
        })
        .select("-email -password -firstName -lastName  -__v ");
      console.log(payload);
      res.json(payload);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },
};
