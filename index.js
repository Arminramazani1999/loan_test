require("express-async-errors");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const router = require("./src/routes");
const dotenv = require('dotenv');
const passport = require("passport");
dotenv.config()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(passport.initialize());
// app.use(passport.session());

//db
mongoose
.connect(process.env.DB_URL)
.then(()=> console.log("connected to mongodb"))
.catch(()=> console.log("could not coonect to mongodb"))

app.use("/api", router);

const port = process.env.port || 3000;
app.listen(port, ()=> console.log(`listening on port ${port}`));

    