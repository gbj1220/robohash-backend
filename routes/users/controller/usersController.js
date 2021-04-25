const mongoErrorParser = require("../../lib/mongoErrorParser");
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");

require("dotenv").config();

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

  login: async (req, res) => {
    try {
      let foundUser = await User.findOne({ email: req.body.email });

      if (!foundUser) {
        throw {
          message:
            "Email is not registered. Please sign up to create an account.",
        };
      }

      let comparedPassword = await bcrypt.compare(
        req.body.password,
        foundUser.password
      );

      if (!comparedPassword) {
        throw {
          message: "Password is incorrect. Please try again.",
        };
      } else {
        let jwtToken = jwt.sign(
          {
            email: foundUser.email,
          },
          process.env.JWT_SECRET,
          { expiresIn: "8h" }
        );
        res.json({
          jwtToken: jwtToken,
        });
      }
    } catch (e) {
      res.status(500).json(mongoErrorParser(e));
    }
  },

  // sendEmail: async (req, res) => {
  //   try {
  //     let transporter = nodemailer.createTransport({
  //       host: "google",
  //       port: 587,
  //       secure: false, // true for 465, false for other ports
  //       auth: {
  //         user: "3531op@gmail.com", // generated ethereal user
  //         pass: "ModerTuh27", // generated ethereal password
  //       },
  //     });

  //     const msg = {
  //       from: "3531op@gmail.com", // going to be the users email
  //       to: "gregory.johnson@code-immersives.com", // list of friends/contacts
  //       subject: "Email from node", // Subject line
  //       text: "Hello", // plain text body
  //     };

  //     const info = await transporter.sendMail(msg);
  //     res.send("Email sent! ");
  //   } catch (e) {
  //     res.status(500).json(mongoErrorParser(e));
  //   }
  // },

  sendEmail: (req, res) => {
    sgMail.setApiKey(process.env.SEND_GRID);
    const msg = {
      to: "3531op@gmail.com", // Change to your recipient
      from: "gregory.johnson@codeimmersives.com", // Change to your verified sender
      subject: "Sending with SendGrid is Fun",
      text: "and easy to do anywhere, even with Node.js",
    };
    sgMail
      .send(msg)
      .then(() => {
        res.json({
          message: "email sent!",
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: error.message,
        });
      });
  },
};
