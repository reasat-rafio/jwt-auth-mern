const User = require("../models/authSchema");
const { find } = require("../models/authSchema");
const jwt = require("jsonwebtoken");

// ?    Handling the errors
const handleErrors = (err) => {
  console.log(err);

  const error = {
    username: "",
    email: "",
    password: "",
  };

  // !  User email already exists / Email is not unique
  if (err.code === 11000) {
    error.email = "This user is already exist";
    return error;
  }

  // !  if login email is incorrect
  if (err.message === "Incorrect email") {
    error.email = "That email is not registered";
  }

  // ! if password not matched
  if (err.message === "Password not matched") {
    error.password = "Password not matched";
  }

  // !  validation errors
  if (err.name === "ValidationError") {
    Object.values(err.errors).forEach(({ properties }) => {
      error[properties.path] = properties.message;
    });
  }
  return error;
};

const maxAge = 3 * 24 * 60 * 60;

// ! Creating a jsw token
const newToken = (id) => {
  return jwt.sign({ id }, "secret", { expiresIn: maxAge });
};

// ! @decs The view of the home page
// ? @method    GET
module.exports.show_home_page = (req, res, next) => {
  res.send("YO BOi");
};

// ! @decs when user will go LOGIN page
// ? @method    GET
module.exports.login_get = (req, res, next) => {
  res.send("login_get");
};

// ! @decs when user will go SIGNUP page
// ? @method    GET
module.exports.signup_get = (req, res, next) => {
  res.send("signup_get");
};

// ! @decs when user will submit the LOGIN page
// ? @method    POST
module.exports.login_post = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.login(email, password);

    res.cookie("kajkorese", true, { httpOnly: true, maxAge: maxAge * 10000 });
    res.status(200).json({
      user: user._id,
    });
    const token = newToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({
      errors,
    });
  }
};

// ! @decs when user will submit the SIGNUP page
// ? @method    POST
module.exports.signup_post = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({
      username,
      email,
      password,
    });

    const token = newToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

    res.status(201).json(user);
  } catch (error) {
    const errors = handleErrors(error);
    res.status(401).json({
      errors,
    });
  }
};
