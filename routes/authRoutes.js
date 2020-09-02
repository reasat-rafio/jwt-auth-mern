const { Router } = require("express");

const {
  show_home_page,
  login_get,
  login_post,
  signup_get,
  signup_post,
} = require("../controllers/authControllers");

const router = Router();

router.route("/").get(show_home_page);
router.route("/login").get(login_get).post(login_post);
router.route("/signup").get(signup_get).post(signup_post);

module.exports = router;
