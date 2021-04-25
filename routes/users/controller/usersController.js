const mongoErrorParser = require("../../lib/mongoErrorParser");
const User = require("../model/User");
const bcrypt = require("bcryptjs");

module.exports = {
  signUp: async (req, res) => {
    try {
      let salted = await bcrypt.genSalt(10);

      let hashedPassword = await bcrypt.hash(req.body.password, salted);

      let { firstName, lastName, email } = req.body;

      let createdUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      let savedUser = await createdUser.save();

      res.json({
        data: savedUser,
      });
    } catch (e) {
      res.status(500).json(mongoErrorParser(e));
    }
  },
};
