const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bookSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  name_en: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String,

    required: true
  },
  author: {
    type: String,
    required: true
  },
  press: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "UserDB",
    index: true,
    require: true
  },
  public: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("bookDB", bookSchema);
