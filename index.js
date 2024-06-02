require("express-async-errors");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const router = require("./src/routes");
const dotenv = require("dotenv");
const passport = require("passport");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
dotenv.config();
const cron = require("node-cron");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("connected to mongodb"))
  .catch((e) => console.log("could not coonect to mongodb == ", e));

// // هر 5 دقیقه یک بار اجرا شود
// cron.schedule("*/5 * * * *", () => {
//   console.log("کار زمان‌بندی شده اجرا شد!");
//   // کد مورد نظر خود را اینجا قرار دهید
// });
app.use("/api", router);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));

//"start": "node index.js"
// "start": "set DEBUG=app:main && nodemon index.js"
