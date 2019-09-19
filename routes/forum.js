const express = require("express");
const forumController = require("../controllers/forum");
const isAuth = require("../middleware/isAuth");
const AdminOrTeacher = require("../middleware/AdminOrTeacher");
const { body } = require("express-validator/check");

const router = express.Router();

router.post("/topic/add", forumController.addTopic);

router.get("/topic/get-all", forumController.getAllTopics);

router.post("/post/add", forumController.addPost);

router.get("/post/get/:id", forumController.getPost);

router.post("/post/add-reply", forumController.addReply);

router.post("/post/rating/add", isAuth, forumController.addRating);

router.get("/post/get-replies/:id", forumController.getReplies);

module.exports = router;
