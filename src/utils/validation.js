const validator = require("validator");

const validateSignUp = (req, res) => {
  const { firstName, lastName, email, password, gender } = req.body;
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

module.exports = {
  validateSignUp,
};
