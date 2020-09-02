const mongoose = require("mongoose");
const { isEmail, isAlphanumeric } = require("validator");
const bcrypt = require("bcrypt");

// ? Creating a new Schema
const newUser = new mongoose.Schema({
  username: {
    type: String,
    require: [true, "Username is required"],
    validate: [isAlphanumeric, "User name is invalid"],
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "email is required"],
    validate: [isEmail, "This email is invalid"],
  },
  password: {
    type: String,
    required: [true, "Password is require"],
    minlength: [6, "Password must be more than 6 characters"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// ! Hashing the password
// ? this function will be called before user data submit to mongodb
newUser.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

// ! creating a static mongodb login function
newUser.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const passwordMatched = await bcrypt.compare(password, user.password);
    if (passwordMatched) {
      return user;
    } else {
      throw Error("Password not matched");
    }
  }
  throw Error("Incorrect email");
};

module.exports = mongoose.model("User", newUser);
