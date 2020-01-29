//resources from :https://mongoosejs.com/docs/validation.html
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    require: [true, "User email number required"]
  },
  name: {
    type: String,
    require: true
  },
  phone: {
    type: String
  },
  password: {
    type: String,
    require: [true, "User password number required"]
  },
  book_id: [
    {
      type: Schema.Types.ObjectId,
      ref: "BooksDB"
    }
  ],
  date: {
    type: Date,
    default: Date.new
  }
});
//export the model named Users
module.exports = mongoose.model("UserDB", userSchema);
