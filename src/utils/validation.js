const validator = require("validator");
const mongoose = require("mongoose");

const validatePassword = (password) => {
  if (!password?.trim()) {
    throw new Error("Password is required");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password must be strong");
  }
};

const validateRequestBody = (req, res, keys) => {
  const isValid = keys.every((key) => req.body?.[key]);

  if (!isValid) {
    return res.send({ message: "Invalid request body !!", data: null });
  }
};

const validateSignUp = (req, res) => {
  const { firstName, lastName, email, password, gender } = req.body;
  if (!firstName?.trim()) {
    throw new Error("First Name is required");
  } else if (firstName?.trim()?.length < 2 || firstName?.trim()?.length > 50) {
    throw new Error("First Name must cotain min 2 character or max 50");
  }

  if (!lastName?.trim()) {
    throw new Error("First Name is required");
  } else if (lastName?.trim()?.length < 3 || lastName?.trim()?.length > 50) {
    throw new Error("First Name must cotain min 3 character or max 50");
  }

  if (!gender) {
    throw new Error("Gender is required");
  } else if (
    !["male", "female", "others"].includes(gender?.toLowerCase()?.trim())
  ) {
    throw new Error("Gender must be from male, female, others");
  }

  if (!email?.trim()) {
    throw new Error("Email is required");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid email");
  }

  if (!password?.trim()) {
    throw new Error("Password is required");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password must be strong");
  }
};

const validateProfileEdit = (req, res) => {
  const editableKeys = [
    "firstName",
    "lastName",
    "gender",
    "hobbies",
    "photoUrl",
    "age",
    "about",
    "phoneNumber",
  ];

  validateRequestBody(req, res, editableKeys);

  const { firstName, lastName, gender, hobbies } = req.body;
  if (!firstName?.trim()) {
    throw new Error("First Name is required");
  } else if (firstName?.trim()?.length < 3 || firstName?.trim()?.length > 50) {
    throw new Error("First Name must cotain min 3 character or max 50");
  }

  if (!lastName?.trim()) {
    throw new Error("First Name is required");
  } else if (lastName?.trim()?.length < 3 || lastName?.trim()?.length > 50) {
    throw new Error("First Name must cotain min 3 character or max 50");
  }

  if (!gender) {
    throw new Error("Gender is required");
  } else if (
    !["male", "female", "others"].includes(gender?.toLowerCase()?.trim())
  ) {
    throw new Error("Gender must be from male, female, others");
  }

  if (!hobbies?.length) {
    throw new Error("Hobbies is required");
  }
};

const validateEditPassword = (req, res) => {
  const keysMustPresent = ["currentPassword", "newPassword"];

  validateRequestBody(req, res, keysMustPresent);

  const { currentPassword, newPassword } = req.body;

  validatePassword(currentPassword);
  validatePassword(newPassword);
};

const validateSendRequest = (req, res) => {
  const validStatus = ["interested", "ignored"];

  const { status, toUserId } = req.params;

  if (!status) {
    throw new Error("Error : Invalid data ");
  } else if (!validStatus.some((key) => key === status)) {
    throw new Error("Error : Invalid status ");
  }

  if (!mongoose.Types.ObjectId.isValid(toUserId)) {
    throw new Error("Error : Invalid userId ");
  }
};

const validateReviewRequest = (req, res) => {
  const validStatus = ["accepted", "rejected"];

  const { status, requestId } = req.params;

  if (!status) {
    throw new Error("Error : Invalid data ");
  } else if (!validStatus.some((key) => key === status)) {
    throw new Error("Error : Invalid status ");
  }

  if (!mongoose.Types.ObjectId.isValid(requestId)) {
    throw new Error("Error : Invalid requestId ");
  }
};

module.exports = {
  validateSignUp,
  validateProfileEdit,
  validateEditPassword,
  validateSendRequest,
  validateReviewRequest,
};
