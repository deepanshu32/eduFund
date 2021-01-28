const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config")
const cryptoRandomString = require("crypto-random-string");

const userSchema = new Schema(
  {
    firstName: {
        trim: true,
        type: String,
        required: [true, "First Name of user is required!"],
        validate(value) {
            if (value.length < 2 || value.length > 50) {
            throw new Error("First Name is invalid!");
            }
        }
    },
    lastName: {
        trim: true,
        type: String,
        required: [true, "First Name of user is required!"],
        validate(value) {
            if (value.length < 2 || value.length > 50) {
            throw new Error("First Name is invalid!");
            }
        }
    },
    email: {
      trim: true,
      type: String,
      unique: [true, "Email already registered"],
      required: [true, "Email is required"],
      validate(value) {
        if (value.length < 10 || value.length > 50) {
          throw new Error("Email should be atleast 5 and atmost 50 characters!");
        }
      }
    },
    mobile: {
      trim: true,
      type: String,
      unique: [true, "Mobile Number already exists"],
      required: [true, "Mobile Number is required"],
      validate(value) {
        if (value.length !== 10) {
          throw new Error("Mobile Number is invalid!");
        }
      }
    },
    password: {
      trim: true,
      type: String,
      require: [true, "Password is required"],
      validate(value) {
        if (value.length < 6 || value.length > 200) {
          throw new Error("Password should be atleast 6 characters!");
        }
      }
    }
  },
  {
    timestamps: true
  }
);

// Profile without password
userSchema.methods.getPublicProfile = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.createdAt;
  delete userObject.updatedAt;
  return userObject;
};

// Generate jwt token
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const randomNumber = Math.floor(Math.random() * 150 + 100);
  const randomString = cryptoRandomString({
    length: randomNumber,
    type: "base64"
  });
  const token = jwt.sign(
    {
      _id: user._id.toString(),
      randomString
    },
    config.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "6h"
    }
  );
  return token;
};

userSchema.methods.comparePassword = async function (password) {
  const user = this;
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return false;
  } else {
    return true;
  }
};

// Find user by credentials
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await Users.findOne({
    email: email
  });
  if (!user) {
    throw new Error("User not found!");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Incorrect password!");
  }
  return user;
};

// Find user by Id
userSchema.statics.finduserById = async _id => {
  const user = await Users.findById({
    _id: _id
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

// Hash the plain text password before saving
userSchema.pre("save", async function (next) {
  const user = this;
  try {
    if (user.isModified("password")) {
      user.password = await bcrypt.hash(user.password, 8);
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Users = mongoose.model("Users", userSchema);

module.exports = Users;