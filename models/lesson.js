const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const exerciseSchema = require("./exercise");

const lessonSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      default: 0
    },
    content: {
      type: String,
      required: false
    },
    exercises: [exerciseSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Lesson", lessonSchema);
