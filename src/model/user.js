const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required !!"],
      validate: function () {
        if (this.firstName?.trim()?.length < 2) {
          throw new Error("First name must be greater than 1 characters !!");
        }
      },
      minLength: [2, "First name must be 2 character long !!"],
      maxLength: [50, "First name must not exceed 20 characters !!"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "First Name is required !!"],
      validate: function () {
        if (!this.lastName?.trim()) {
          throw new Error("Last name is required !!");
        }
        return true;
      },
      trim: true,
    },
    email: {
      type: String,
      unique: [true, "Duplicate email Id"],
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
      validate: function () {
        if (this.phoneNumber?.toString()?.length !== 10) {
          throw new Error("Mobile number must be 10 digit long !!");
        }
      },
    },
    password: { type: String, required: true, trim: true },
    hobbies: { type: [String], default: ["cricket"] },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: (props) => `${props.value} is not supported`,
      },
      required: true,
      lowercase: true,
    },
    about: {
      type: String,
      required: [true, "About is required !!"],
      minLength: [5, "About must be 5 character long !!"],
      maxLength: [100, "About must not exceed 50 characters !!"],
      trim: true,
    },
    photoUrl: {
      type: String,
      default:
        "https://imgs.search.brave.com/MOJNZZ7jZEobQ9JitvnpUAhqvxpu5zwiYbbnQxtiNQg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzlmLzRj/L2YwLzlmNGNmMGYy/NGIzNzYwNzdhMmZj/ZGFiMmU4NWMzNTg0/LmpwZw",
    },
    age: {
      type: Number,
      required: true,
      min: 16,
      max: 100,
    },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function (enteredPassword) {
  const hashedPassword = this.password;
  return await bcrypt.compare(enteredPassword, hashedPassword);
};

userSchema.methods.generateJWT = function () {
  return jwt.sign({ _id: this._id }, process.env.TOKEN_SECRET, {
    expiresIn: "1d",
  });
};
const User = mongoose.model("User", userSchema);

module.exports = User;
