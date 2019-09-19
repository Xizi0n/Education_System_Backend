const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = require("./post");

const topicSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      default: 0
    },
    raters: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post"
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Topic", topicSchema);
