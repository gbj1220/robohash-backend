const jwt = require("jsonwebtoken");
const mongoErrorParser = require("./mongoErrorParser");

const checkForValidJwtToken = async (req, res, next) => {
  try {
    if (req.headers && req.headers.authorization) {
      let jwtToken = req.headers.authorization.slice(7);
      let decodedJwt = jwt.verify(jwtToken, process.env.JWT_SECRET);
      if (decodedJwt) {
        next();
      }
    } else {
      throw {
        message:
          "You do not have permission to enter this site. Please sign in or sign up!",
      };
    }
  } catch (e) {
    res.status(500).json(mongoErrorParser(e));
  }
};

module.exports = {
  checkForValidJwtToken,
};
