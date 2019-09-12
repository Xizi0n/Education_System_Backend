const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: false
    },
    lessons: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lesson"
      }
    ],
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    modifiers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Course", courseSchema);
