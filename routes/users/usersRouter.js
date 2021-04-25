var express = require("express");
var router = express.Router();

var { signUp } = require("./controller/usersController");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/sign-up", signUp);

module.exports = router;
