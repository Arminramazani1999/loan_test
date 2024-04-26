const express = require("express");
const router = express.Router();
const controllere = require("./controller");
const validator = require("./validator");
const passport = require("passport");
const uploadImages = require("../../upload/uploadImages");
const { isLoggined, isAdmin } = require("../../midelweres/auth");
const controller = require("./controller");
const bcrypt = require("bcryptjs");
const User = require("./../../models/user");
const { addListener } = require("../../models/order");

router.post(
  "/register",
  validator.register(),
  controller.validate,
  (req, res, next) => {
    passport.authenticate("local.register", (err, user, info) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!user) {
        return res.status(400).json({ error: info.message });
      }

      // Send a success response back to the client
      return res.status(200).json({ message: info.message, user: user });
    })(req, res, next);
  }
);

router.post("/test", (req, res) => {
  console.log("===============test ");
  console.log("body_test: ", req.body);
  return res.json({
    data:{message:"AaaaAAAAAAAAALLLLLL===========+AAAAA"}
  });
});

// router.post("/login", validator.login(), controller.login);
// // update
// router.put("/:id", isLoggined, controller.update);

// //---------admin------
// delete
router.delete("/:id", controller.delete);
// // all
router.get("/", controller.getAll);
// see one
router.get("/:id", controller.seeOne);

module.exports = router;

// (req, res, next) => {
//   console.log(req.body.name);
//   try {
//     fetch("http://localhost:3000/api/auth/test",{
//       method: "POST",
//       body: JSON.stringify(req.body),
//     })
//     .then(res => res.json())
//     .then(data => console.log("data: "+data))
//     console.log("aree")
//   } catch (error) {
//     onsole.log("myError"+erroe);
//   }
// },
// async (req, res, next) => {
//   try {
//     console.log(req.body.name);
//     let user = await User.findOne({ email: ali }); // email = req.body.email
//     console.log("user: "+user);
//     if (user) {
//       res.json({ message: "ا این ایمیل قبلا ثبت نام شده است " });
//     }
//     const newUser = new User({
//       phone: req.body.phone,
//       id_code: req.body.id_code,
//       name: req.body.name,
//       email: req.body.email,
//       password: bcrypt.hashSync(req.body.password, 8),
//     });
//     await newUser.save();
//     console.log("salam");
//     res.json({ message: "ثبت نام با موفقیت انجام شد" });
    
//   } catch (error) {
//     res.json({ message: error });
//   }
    
// },