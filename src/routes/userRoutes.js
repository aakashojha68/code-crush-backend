const express = require("express");
const { authUser } = require("../middleware/authUser");
const User = require("../model/user");
const userRouter = express.Router();

userRouter.get("/profile/view", authUser, async (req, res) => {
  res.send(req.user);
});

userRouter.delete("/profile/delete", authUser, async (req, res) => {
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

userRouter.patch("/profile/edit", authUser, async (req, res) => {
  try {
    // TODO: sanitize the req.body and add more fields to editable
    const { firstName, lastName, hobbies } = req.body;
    const { _id } = req.user;

    const response = await User.findByIdAndUpdate(
      _id,
      {
        firstName,
        lastName,
        hobbies,
      },
      { new: true }
    );

    if (!response) {
      throw new Error("User not found !!");
    }
    res.send("User updated successfully !!");
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

module.exports = userRouter;
