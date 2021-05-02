const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const axios = require("axios");

require("dotenv").config();

module.exports = {
  signUp: async (req, res) => {
    try {
      let salted = await bcrypt.genSalt(10);

      let hashedPassword = await bcrypt.hash(req.body.password, salted);

      const { firstName, lastName, email } = req.body;

      const createdUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      const savedUser = await createdUser.save();

      res.json({
        data: savedUser,
      });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },

  login: async (req, res) => {
    try {
      const foundUser = await User.findOne({ email: req.body.email });

      if (!foundUser) {
        throw {
          message:
            "Email is not registered. Please sign up to create an account.",
        };
      }

      const comparedPassword = await bcrypt.compare(
        req.body.password,
        foundUser.password
      );

      if (!comparedPassword) {
        throw {
          message: "Password is incorrect. Please try again.",
        };
      } else {
        const jwtToken = jwt.sign(
          {
            email: foundUser.email,
          },
          process.env.JWT_SECRET,
          { expiresIn: "8h" }
        );
        res.json({
          jwtToken,
        });
      }
    } catch (e) {
      res.status(500).json({ message: e.message });
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
      to: ["3531op@gmail.com", "gregory.johnson@codeimmersives.com"], // Change to your recipient // can use multiple addresses using array
      from: "verklebende@fremontquote.com", // Change to your verified sender
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
