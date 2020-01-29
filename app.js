// Require packages from node
const express = require("express");
const app = express();
const port = 3000;
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const BookDB = require("./models/book.js");
const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport");
require("./config/passport")(passport);
const flash = require("connect-flash");
//Distinguish The Environment
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
//Setting handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
//Use static files
app.use(express.static("public"));
//use method override
app.use(methodOverride("_method"));
//Use body parser
app.use(bodyParser.urlencoded({ extended: true }));
//Setting mongoose
mongoose
  .connect("mongodb://127.0.0.1/book", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("DB connected"));
db = mongoose.connection;
db.on("error", () => {
  console.log("db error");
});
db.once("open", () => {
  console.log("db connected");
});
// setting the certification system
app.use(
  session({
    secret: "acb",
    resave: false,
    saveUninitialized: true
  })
);
//init passport
app.use(passport.initialize());
app.use(passport.session());
//init flash
app.use(flash());
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.success_msg = req.flash("success_msg").toString();
  res.locals.warning_msg = req.flash("warning_msg").toString();
  next();
});

//routes
app.use("/books", require("./routes/books.js"));
app.use("/", require("./routes/home.js"));
app.use("/users", require("./routes/users.js"));
app.use("/auth", require("./routes/auth"));

app.listen(port, () => {
  console.log(`express is listening on the port:${port}`);
});
