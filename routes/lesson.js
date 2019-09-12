const express = require("express");
const lessonController = require("../controllers/lesson");
const isAuth = require("../middleware/isAuth");
const AdminOrTeacher = require("../middleware/AdminOrTeacher");
const { body } = require("express-validator/check");

const router = express.Router();
//////////////////////////////////////////////////////
// Lessons
/////////////////////////////////////////////////////
router.post(
  "/add",
  isAuth,
  AdminOrTeacher,
  [
    body("courseId")
      .not()
      .isEmpty(),
    body("title")
      .not()
      .isEmpty()
      .trim()
      .isAlphanumeric(),
    body("content")
      .not()
      .isEmpty()
  ],
  lessonController.addLesson
);
router.post(
  "/update",
  isAuth,
  AdminOrTeacher,
  [
    body("lessonId")
      .not()
      .isEmpty(),
    body("updatedLesson")
      .not()
      .isEmpty()
  ],
  lessonController.updateLesson
);
router.post(
  "/remove",
  isAuth,
  AdminOrTeacher,
  [
    body("lessonId")
      .not()
      .isEmpty(),
    body("courseId")
      .not()
      .isEmpty()
  ],
  lessonController.removeLesson
);
router.get("/get/:id", isAuth, lessonController.getLesson);
//////////////////////////////////////////////////////
// Exercise
/////////////////////////////////////////////////////
router.post(
  "/add-exercise",
  isAuth,
  AdminOrTeacher,
  lessonController.addExercise
);
router.post(
  "/update-exercise",
  isAuth,
  AdminOrTeacher,
  lessonController.updateExercise
);
router.post(
  "/delete-exercise",
  isAuth,
  AdminOrTeacher,
  lessonController.removeExercise
);

module.exports = router;
