const express = require("express");
const authController = require("../controllers/auth");
const { body } = require("express-validator/check");

const router = express.Router();

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .not()
      .isEmpty(),
    body("password")
      .trim()
      .isLength({ min: 5 })
  ],
  authController.singInUser
);

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .not()
      .isEmpty()
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 5 }),
    body("name")
      .trim()
      .not()
      .isEmpty()
  ],
  authController.signUpUser
);

//router.post("signup");

module.exports = router;
