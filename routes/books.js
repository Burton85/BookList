const express = require("express");
const router = express.Router();
const BookDB = require("../models/book");
const { authenticated } = require("../config/auth");
//Go to show page
router.get("/:id", authenticated, (req, res) => {
  const permission = false;
  BookDB.find((err, books) => {
    if (err) return console.log("show error");
    const booksResults = books.filter(
      item => item._id.toString() === req.params.id
    ); // find the data match with parameter id

    if (booksResults[0].userId == req.user._id) permission = true; //check if the user is the author to the data
    res.render("show", { book: booksResults[0], permission });
  });
});
//edit page
router.get("/:id/edit", authenticated, (req, res) => {
  BookDB.find((err, books) => {
    if (err) return console.log("error");
    const booksResults = books.filter(
      item => item._id.toString() === req.params.id
    );
    res.render("edit", { book: booksResults[0] });
  });
});
router.put("/:id/edit", (req, res) => {
  const editBook = req.body;
  const bookId = req.params.id;
  BookDB.find((err, books) => {
    const bookCol = books.filter(item => item._id == bookId);
    const bookData = bookCol[0];
    if (err) return console.log("read error");
    else if (!bookData) return console.log("cant find data");
    else {
      if (editBook.name != "") bookData.name = editBook.name;
      if (editBook.category != "") bookData.category = editBook.category;
      if (editBook.author != "") bookData.author = editBook.author;
      if (editBook.description != "")
        bookData.description = editBook.description;
      if (editBook.image != "") bookData.image = editBook.image;

      bookData.save(err => {
        if (err) return console.log("save error");
        return res.redirect(`/books/${bookId}`);
      });
    }
  });
});
//Delete books
router.delete("/:id/delete", (req, res) => {
  const bookId = req.params.id;
  BookDB.findById(bookId, (err, book) => {
    book.remove(err => {
      if (err) return console.log("remove error");
      return res.redirect("/");
    });
  });
});

module.exports = router;
