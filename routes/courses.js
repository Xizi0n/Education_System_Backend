const express = require("express");
const coursesController = require("../controllers/courses");
const { body } = require("express-validator/check");

const router = express.Router();
const isAuth = require("../middleware/isAuth");
const isAdmin = require("../middleware/isAdmin");
const AdminOrTeacher = require("../middleware/AdminOrTeacher");

router.post(
  "/add",
  isAuth,
  AdminOrTeacher,
  [
    body("name")
      .isAlphanumeric()
      .withMessage("Course name should be alfanumeric")
      .not()
      .isEmpty()
  ],
  coursesController.addCourse
);
router.get("/get/:id", isAuth, coursesController.getCourse);
router.get("/get-all", isAuth, coursesController.getCourses);
router.post("/delete", isAuth, AdminOrTeacher, coursesController.removeCourse);
router.post(
  "/update",
  isAuth,
  AdminOrTeacher,
  [
    body("name")
      .isAlphanumeric()
      .withMessage("Course name should be alfanumeric")
      .not()
      .isEmpty()
  ],
  coursesController.updateCourse
);

module.exports = router;
