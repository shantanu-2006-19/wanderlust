const express = require("express");
const app = express();
const flash = require("connect-flash");
const session = require("express-session");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


let sessionOption = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
};

app.use(session(sessionOption));
app.use(flash());

app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
});

app.get("/register", (req, res) => {
    let { name = "anonymous" } = req.query;
    req.session.name = name;

    if (name === "anonymous") {
        req.flash("error", "user not register successfully");
    } else {
        req.flash("success", "user register successfully");
    }

    res.redirect("/hello");
});

app.get("/hello", (req, res) => {

    res.render("index.ejs", { name: req.session.name });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
