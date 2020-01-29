const express = require("express");
const router = express.Router();
const BookDB = require("../models/book");
const UserDB = require("../models/users");
const FavoriteDB = require("../models/favorite");

const mongoose = require("mongoose");
const { authenticated } = require("../config/auth");

//餐廳總覽
router.get("/", authenticated, (req, res) => {
  const keywords = req.query.keywords;
  let sorts = req.query.sorts;
  BookDB.find({ public: true }, (err, books) => {
    if (err) return console.log("find err");
    if (keywords) {
      books = books.filter(item => {
        return (
          item.name.toLowerCase().includes(keywords.toLowerCase()) ||
          item.name_en.toLowerCase().includes(keywords.toLowerCase()) ||
          item.category.toLowerCase().includes(keywords.toLowerCase()) ||
          item.author.toLowerCase().includes(keywords.toLowerCase())
        );
      });
    }
    if (sorts == "asc")
      books = books.sort((a, b) => {
        sorts = "A-Z";
        return a.name > b.name ? 1 : -1;
      });
    else if (sorts == "desc")
      books = books.sort((a, b) => {
        sorts = "Z-A";
        return a.name > b.name ? -1 : 1;
      });
    else if (sorts == "rating")
      books = books.sort((a, b) => {
        sorts = "評分";
        return a.rating > b.rating ? -1 : 1;
      });
    else if (sorts == "area")
      books = books.sort((a, b) => {
        sorts = "地區";
        return a.author > b.author ? 1 : -1;
      });
    return res.render(`index`, {
      books: books,
      keywords: keywords,
      sorts: sorts
    });
  });
});
// 最愛的餐廳
router.get("/favorite", authenticated, (req, res) => {
  const keywords = req.query.keywords;
  let sorts = req.query.sorts;
  FavoriteDB.find({ userId: req.user._id }).then(favorites => {
    BookDB.findById(favorites.bookId, (err, books) => {
      if (err) return console.log("bookDB err");
      if (keywords) {
        books = books.filter(item => {
          return (
            item.name.toLowerCase().includes(keywords.toLowerCase()) ||
            item.name_en.toLowerCase().includes(keywords.toLowerCase()) ||
            item.category.toLowerCase().includes(keywords.toLowerCase()) ||
            item.author.toLowerCase().includes(keywords.toLowerCase())
          );
        });
      }
      if (sorts == "asc")
        books = books.sort((a, b) => {
          sorts = "A-Z";
          return a.name > b.name ? 1 : -1;
        });
      else if (sorts == "desc")
        books = books.sort((a, b) => {
          sorts = "Z-A";
          return a.name > b.name ? -1 : 1;
        });
      else if (sorts == "rating")
        books = books.sort((a, b) => {
          sorts = "評分";
          return a.rating > b.rating ? -1 : 1;
        });
      else if (sorts == "author")
        books = books.sort((a, b) => {
          sorts = "作者";
          return a.author > b.author ? 1 : -1;
        });
      return res.render(`index`, {
        books: books,
        keywords: keywords,
        sorts: sorts
      });
    });
  });
});
// 我的餐廳
router.get("/private", authenticated, (req, res) => {
  const keywords = req.query.keywords;
  let sorts = req.query.sorts;

  BookDB.find({ public: false } && { userId: req.user._id }, (err, books) => {
    if (err) return console.log("find err");
    if (keywords) {
      books = books.filter(item => {
        return (
          item.name.toLowerCase().includes(keywords.toLowerCase()) ||
          item.name_en.toLowerCase().includes(keywords.toLowerCase()) ||
          item.category.toLowerCase().includes(keywords.toLowerCase()) ||
          item.author.toLowerCase().includes(keywords.toLowerCase())
        );
      });
    }
    if (sorts == "asc")
      books = books.sort((a, b) => {
        sorts = "A-Z";
        return a.name > b.name ? 1 : -1;
      });
    else if (sorts == "desc")
      books = books.sort((a, b) => {
        sorts = "Z-A";
        return a.name > b.name ? -1 : 1;
      });
    else if (sorts == "rating")
      books = books.sort((a, b) => {
        sorts = "評分";
        return a.rating > b.rating ? -1 : 1;
      });
    else if (sorts == "author")
      books = books.sort((a, b) => {
        sorts = "作者";
        return a.author > b.author ? 1 : -1;
      });
    books.permission = true;
    return res.render(`private`, {
      books: books,
      keywords: keywords,
      sorts: sorts
    });
  });
});

//Create new Book
router.get("/new", authenticated, (req, res) => {
  res.render("new");
});

router.post("/new", authenticated, (req, res) => {
  const Info = req.body;
  let errors = [];
  // const phoneReg = /^09[0-9]{8}$/;
  const rateReg = /[1-9]\d*.\d*|0.\d*[1-9]\d*|[1-9]\d*/;
  if (
    !Info.name ||
    !Info.name_en ||
    !Info.category ||
    !Info.description ||
    !Info.image ||
    !Info.rating ||
    !Info.author ||
    !Info.press
  ) {
    errors.push({ message: "Please fill the necessary field up!" });
  }
  if (!rateReg.test(Info.rating) || !(0 <= parseFloat(Info.rating, 10) <= 5)) {
    errors.push({
      message: "Please input a valid rating score between 0 to 5 "
    });
  }
  if (errors.length > 0) {
    res.render("new", {
      errors,
      Info
    });
  } else {
    const newBook = BookDB({
      userId: req.user._id,
      name: Info.name,
      name_en: Info.name_en,
      category: Info.category,
      author: Info.author,
      press: Info.press,
      description: Info.description,
      image: Info.image,
      rating: Info.rating
    });
    if (Info.public == "disagree") {
      newBook.public = false;
    }
    newBook.save(err => {
      if (err) return console.log(err);
      return res.redirect(`/books/${newBook._id}`);
    });
  }
});
router.put("/:id/put", authenticated, (req, res) => {
  FavoriteDB.find({ bookId: req.params.id } && { userId: req.user._id }).then(
    favorite => {
      if (favorite != null) {
        return res.redirect("/favorite");
      } else {
        const newFavorite = FavoriteDB({
          userId: req.user._id,
          bookId: req.params.id
        });
        newFavorite.save(err => {
          if (err) return console.log(err);
          return res.redirect("/favorite");
        });
      }
    }
  );
});

module.exports = router;
