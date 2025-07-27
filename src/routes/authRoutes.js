const express = require("express");
const User = require("../model/user");
const bcrypt = require("bcrypt");
const { validateSignUp } = require("../utils/validation");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUp(req, res);

    const { firstName, lastName, email, password, gender, phoneNumber, about } =
      req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      gender,
      phoneNumber,
      about,
    });

    const response = await user.save();

    res.send(response);
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      throw new Error("Invalid payload !!");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Invalid credentials !!");
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials !!");
    }

    // create a json web token
    const token = user.generateJWT();

    // send it inside cookie
    res.cookie("token", token);
    res.send("Logged in successfully !!");
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("User log out successfully !!");
});

module.exports = authRouter;
