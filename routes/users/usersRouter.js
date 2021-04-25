const express = require("express");
const router = express.Router();

const { signUp, login, sendEmail } = require("./controller/usersController");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/sign-up", signUp);

router.post("/login", login);

router.post("/send-email", sendEmail);

module.exports = router;
