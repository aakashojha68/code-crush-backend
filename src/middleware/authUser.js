const jwt = require("jsonwebtoken");
const User = require("../model/user");

const authUser = async (req, res, next) => {
  try {
    // console.log(req.cookies);
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Token not valid !!");
    }

    const isTokenValid = jwt.verify(token, "DEV_TENDER_WEB");

    if (!isTokenValid) {
      throw new Error("Token not valid !1");
    }

    const { _id } = isTokenValid;
    const loggedInUser = await User.findOne({ _id: _id });

    if (!loggedInUser) {
      throw new Error("User not found !!");
    }

    req.user = loggedInUser;
    next();
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
};

module.exports = {
  authUser,
};
