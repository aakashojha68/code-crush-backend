const express = require("express");
const { authUser } = require("../middleware/authUser");
const User = require("../model/user");
const bcrypt = require("bcrypt");
const userProfileRoutes = express.Router();

const {
  validateProfileEdit,
  validateEditPassword,
} = require("../utils/validation");

userProfileRoutes.get("/profile/view", authUser, async (req, res) => {
  res.send({ message: "User details fetched successfully !!", data: req.user });
});

userProfileRoutes.delete("/profile/delete", authUser, async (req, res) => {
  try {
    const { _id } = req.user;
    const response = await User.findByIdAndDelete(_id);

    if (!response) {
      throw new Error("User not found !!");
    }

    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("User deleted successfully !!");
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

userProfileRoutes.patch("/profile/edit", authUser, async (req, res) => {
  try {
    // sanitize the req.body and add more fields to editable
    validateProfileEdit(req, res);

    const { firstName, lastName, hobbies, gender } = req.body;
    const { _id } = req.user;

    const response = await User.findByIdAndUpdate(
      _id,
      {
        firstName,
        lastName,
        hobbies,
        gender,
      },
      { new: true }
    );

    if (!response) {
      // throw new Error("User not found !!");
      return res.send({ message: "User not found !!", data: null });
    }

    res.send({
      message: "Userd details updated successfully !!",
      data: response,
    });
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

userProfileRoutes.patch(
  "/profile/edit/password",
  authUser,
  async (req, res) => {
    try {
      // sanitize req.body
      validateEditPassword(req, res);
      const { currentPassword, newPassword } = req.body;

      const loggedInUser = req.user;

      // check is current Password valid or not
      const isPasswordValid = await loggedInUser.comparePassword(
        currentPassword
      );

      if (!isPasswordValid) {
        return res
          .status(400)
          .send({ message: "Invalid password !!", data: null });
      }

      // check newPassword is same as current Password
      const isSamePassowrd = await loggedInUser.comparePassword(newPassword);

      if (isSamePassowrd) {
        return res.status(400).json({
          message: "New password cannot be same as current password.",
        });
      }

      const newPasswordHash = await bcrypt.hash(newPassword, 10);

      await User.findByIdAndUpdate(loggedInUser._id, {
        password: newPasswordHash,
      });

      res.send({ message: "Password changed successfully !!", data: null });
    } catch (error) {
      res.status(400).send("Error : " + error.message);
    }
  }
);

module.exports = userProfileRoutes;
