const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { name } = require("ejs");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/default.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

// hash algo
userSchema.pre("save", async function (next) {
  const User = this;
  if (!User.isModified("password")) return next();
  try {
    // gen salt
    const salt = await bcrypt.genSalt(10);
    //hash password
    const hashPassword = await bcrypt.hash(User.password, salt);
    // override the hashed password with hashed one
    User.password = hashPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

// compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    //comapre password
    const isMatchPassword = await bcrypt.compare(
      candidatePassword,
      this.password
    );

    return isMatchPassword;
    // const token = genereteToken(isMatchPassword);
    // return token;
  } catch (error) {
    throw error;
  }
};

//model
const userDb = mongoose.model("user", userSchema);

module.exports = userDb;
