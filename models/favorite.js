const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const favoriteSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "UserDB",
    index: true,
    require: true
  },
  bookId: {
    type: Schema.Types.ObjectId,
    ref: "bookDB",
    index: true,
    require: true
  }
});

module.exports = mongoose.model("favoriteDB", favoriteSchema);
