const Topic = require("../models/topic");
const Post = require("../models/post");
const Reply = require("../models/reply");
//////////////////////////////////////////////////////
// Topic
/////////////////////////////////////////////////////
module.exports.addTopic = (req, res, next) => {
  const { name } = req.body;
  const topic = new Topic({
    name: name
  });

  topic
    .save()
    .then(topic => {
      console.log(topic);
      res.status(201).json({ messgae: "OK" });
    })
    .catch(err => {
      next(err);
    });
};

module.exports.getAllTopics = (req, res, next) => {
  Topic.find()
    /* .populate({
      path: "posts",
      populate: {
        path: "author",
        model: "User"
      }
    }) */
    .then(topics => {
      console.log(topics);
      res.status(200).json(topics);
    })
    .catch(err => next(err));
};

//////////////////////////////////////////////////////
// Post
/////////////////////////////////////////////////////
module.exports.addPost = (req, res, next) => {
  //TODO userid should come from req.userId
  const { topicId, postToSave, userId } = req.body;
  const post = new Post({
    title: postToSave.title,
    author: userId,
    content: postToSave.content
  });

  post.save().then(post => {
    const savedPost = post;
    Topic.findOne({ _id: topicId })
      .then(topic => {
        topic.posts.push(savedPost._id);
        return topic.save();
      })
      .then(topic => {
        res.status(201).json({ message: "OK" });
      })
      .catch(err => {
        next(err);
      });
  });
};
module.exports.getPost = (req, res, next) => {
  const postId = req.params.id;

  Post.findOne({ _id: postId })
    .populate("raters replies author")
    .then(post => {
      res.status(200).json(post);
    })
    .catch(err => next(err));
};

module.exports.addRating = (req, res, next) => {
  const { postId } = req.body;
  const userId = req.userId;

  Post.findOne({ _id: postId })
    .then(post => {
      if (post) {
        if (!post.raters.includes(userId)) {
          post.raters.push(userId);
          post.rating++;
          post.save().then(result => {
            res.status(200).json({ message, code: 200 });
          });
        } else {
          res.status(403).json({ message: "You already rated", code: 403 });
        }
      }
    })
    .catch(err => {
      next(err);
    });
};
//////////////////////////////////////////////////////
// Reply
/////////////////////////////////////////////////////
module.exports.addReply = (req, res, next) => {
  const { postId, replyToSave } = req.body;
  console.log("[PostID]: ", postId);

  const replyObject = new Reply(replyToSave);

  replyObject
    .save()
    .then(reply => {
      const savedReply = reply;
      Post.findOne({ _id: postId })
        .then(post => {
          if (post) {
            console.log(post.replies);
            post.replies.push(savedReply._id);
            return post.save();
          }
        })
        .then(result => {
          res.status(200).json({ message: "OK" });
        })
        .catch(err => {
          next(err);
        });
    })
    .catch(err => next(err));
};

module.exports.getReplies = (req, res, next) => {
  const postId = req.params.id;

  Post.findOne({ _id: postId })
    .populate({
      path: "replies",
      populate: {
        path: "author",
        model: "User",
        select: "name"
      }
    })
    .then(post => {
      res.status(200).json(post);
    });
};
