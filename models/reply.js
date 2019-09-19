const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const replySchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User"
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
    content: {
      type: String,
      required: true
    },
    code: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reply", replySchema);
