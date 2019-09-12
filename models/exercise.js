const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const exerciseSchema = new Schema(
  {
    declaration: {
      type: String,
      required: true
    },
    explanation: {
      type: String,
      required: true
    },
    language: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: false,
      default: 1
    }
  },
  {
    timestamps: true
  }
);

module.exports = exerciseSchema;
