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

module.exports.getTopic = (req, res, next) => {
  const topicId = req.params.id;
  Topic.findOne({ _id: topicId })
    .populate("posts")
    .then(topic => {
      if (topic) {
        res.status(200).json(topic);
      } else {
        res.status(404);
      }
    });
};

//////////////////////////////////////////////////////
// Post
/////////////////////////////////////////////////////
module.exports.addPost = (req, res, next) => {
  const { topicId, postToSave } = req.body;
  const userId = req.userId;
  const post = new Post({
    title: postToSave.title,
    author: userId,
    content: postToSave.message,
    code: postToSave.code || ""
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

module.exports.deletePost = (req, res, next) => {
  const { postId } = req.body;

  Post.findOne({ _id: postId }).then(post => {
    if (post) {
      if (post.replies.length === 0) {
        console.log("No replies");
        post
          .remove()
          .then(result => {
            res.status(200).json({ message: "Succesful delete" });
          })
          .catch(err => {
            next(err);
          });
      } else {
        console.log("replies found");
        const deletePromises = [];
        post.replies.forEach(replyId =>
          deletePromises.push(Reply.findByIdAndDelete(replyId).exec())
        );
        const loadedPost = post;
        Promise.all(deletePromises)
          .then(sucess => {
            console.log("all replies deleted");
            return loadedPost.remove();
          })
          .then(sucess => {
            res.status(200).json({ message: "Succesful delete" });
          })
          .catch(err => next(err));
      }
    }
  });
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
