const express = require("express");
const app = express();
const mongoose = require("mongoose");
const colors = require("colors");
const cookie = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");

const authRoutes = require("./routes/authRoutes");

// ?    middleware
app.use(express.json());
app.use(cookie());

const URI =
  "mongodb+srv://raf:1234@testcluster1.s4ly9.mongodb.net/user-auth?retryWrites=true&w=majority";

// ?    connecting to mongodb and server
mongoose
  .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(5000, console.log(" server started at 5000".yellow.bold))
  )
  .catch((err) => console.log(err));

//   ? Routes
app.get("*", checkUser);
app.get("/smoothies", requireAuth, (req, res) => res.render("smoothies"));
app.use(authRoutes);
