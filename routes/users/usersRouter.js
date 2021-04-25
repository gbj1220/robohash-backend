const express = require("express");
const router = express.Router();

const { signUp, login } = require("./controller/usersController");

const {
  checkIfInputIsEmpty,
  checkForSymbolsMiddleWare,
  checkForStrongPassword,
  checkIfLoginIsEmpty,
} = require("../lib/validator");
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post(
  "/sign-up",
  checkIfInputIsEmpty,
  checkForSymbolsMiddleWare,
  checkForStrongPassword,
  signUp
);

router.post("/login", checkIfLoginIsEmpty, login);

module.exports = router;
