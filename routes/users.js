const express = require("express");
const userController = require("../controllers/user");
const isAuth = require("../middleware/isAuth");
const isAdmin = require("../middleware/isAdmin");
const AdminOrTeacher = require("../middleware/AdminOrTeacher");
const { body } = require("express-validator/check");

const router = express.Router();

router.post(
  "/delete",
  isAuth,
  isAdmin,
  [
    body("userId")
      .not()
      .isEmpty()
  ],
  userController.deleteUser
);
router.post("/update", isAuth, userController.updateUser);
router.get("/get/:id", isAuth, userController.getUser);
router.get("/get-all", isAuth, isAdmin, userController.getUsers);

module.exports = router;
