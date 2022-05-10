const app = require("express")();

const cors = require("cors");
const express = require("express");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const http = require("http").Server(app);
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");

const { sequelize } = require("./models");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("santhosh"));
app.use(
  session({
    key: "user_sid",
    secret: "santhosh",
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: 60000,
    },
  })
);

// app.use(session({ resave: false, saveUninitialized: true, secret: 'santhosh' }));
app.use(flash());

app.use("/public", express.static("public"));
app.use("/static", express.static("media"));

app.get("/layouts/", function (req, res) {
  res.render("view");
});

//For set layouts of html view
const expressLayouts = require("express-ejs-layouts");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("layout", "layouts/index");
app.use(expressLayouts);
//* Routes
require("./routers")(app);

sequelize.sync({ force: false, alter: false }).then(() => {
  http.listen(3000, function () {
    console.log("listening on *:3000");
  });
});
