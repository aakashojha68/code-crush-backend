const jwt = require("jsonwebtoken");
const User = require("../model/user");
const { USER_SAFE_DATA } = require("../utils/constants");

const authUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Token not valid !!", data: null });
    }

    const isTokenValid = jwt.verify(token, "DEV_TENDER_WEB");

    if (!isTokenValid) {
      return res
        .status(401)
        .json({ message: "Token not valid !!", data: null });
    }

    const { _id } = isTokenValid;
    const loggedInUser = await User.findOne({ _id: _id }).select(
      USER_SAFE_DATA
    );

    if (!loggedInUser) {
      return res.status(400).json({ message: "User not found !!", data: null });
    }

    req.user = loggedInUser;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: error.message,
        data: null,
      });
    } else {
      return res
        .status(400)
        .send({ message: "Error : " + error.message, data: null });
    }
  }
};

module.exports = {
  authUser,
};
