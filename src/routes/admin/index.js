const express = require("express");
const router = express.Router();
const controllere = require("./controller");
const validator = require("./validator");
const passport = require("passport");
const uploadImages = require("../../upload/uploadImages");
const {
  isLoggined,
  isAdmin,
  firstRegister,
  firstRegisterStatus,
  creditAuth,
} = require("../../midelweres/auth");
const controller = require("./controller");
const User = require("./../../models/user");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const Kavenegar = require("kavenegar");

// otp 1 =============== get phone
router.post(
  "/getPhone",
  validator.getPhone(),
  controller.validate,
  controller.getPhone
);

// otp 2 ================== auth sms verificationCodeInput
router.post(
  "/verificationCodeInput",
  validator.getCode(),
  controller.validate,
  controller.verificationCodeInput
);

router.post(
  // first register
  "/register",
  validator.register(),
  controller.validate,
  isLoggined,
  firstRegister,
  controller.register
);
router.post(
  // ColleagueRegisterLegal حقوقی
  "/ColleagueRegister/legal",
  // validator.register(),
  controller.validate,
  isLoggined,
  controller.ColleagueRegisterLegal
);
router.post(
  // ColleagueRegisterGenuine حقیقی
  "/ColleagueRegister/genuine",
  // validator.register(),
  controller.validate,
  isLoggined,
  // firstRegister,
  controller.ColleagueRegisterGenuine
);

// credit auth
router.post(
  "/creditauth",
  isLoggined,
  firstRegisterStatus,
  // creditAuth,
  //auth
  (req, res, next) => {
    try {
      let user = req.user;
      // return console.log(user);
      fetch("http://localhost:3000/api/auth/test", {
        method: "POST",
        body: JSON.stringify({
          nationalCode: user.nationalCode,
        }),
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          dataCredit = data;
          if (!data.auth) {
            return res.json({
              message: "کد ملی اشتباه",
            });
          }
          next();
        });
    } catch (error) {
      onsole.log("myError" + erroe);
    }
  },
  controller.creditAuth
  // async (req, res) => {
  //   try {
  //     let user = req.user;
  //     if (dataCredit.auth == "A") {
  //       user.loanCeiling = 100;
  //       user.creditAuth = true;
  //       user.creditAuthStatus = true;
  //       await user.save();
  //       return res.json({
  //         message: `شما تا سقف ۱۰۰ میلیون مینوانید درخواست وام کنید`,
  //       });
  //     }
  //     if (dataCredit.auth == "B") {
  //       user.loanCeiling = 75;
  //       user.creditAuth = true;
  //       user.creditAuthStatus = true;
  //       await user.save();
  //       return res.json({
  //         message: `شما تا سقف 75 میلیون مینوانید درخواست وام کنید`,
  //       });
  //     }
  //     if (dataCredit.auth == "C") {
  //       user.loanCeiling = 50;
  //       user.creditAuth = true;
  //       user.creditAuthStatus = true;
  //       await user.save();
  //       return res.json({
  //         message: `شما تا سقف 50 میلیون مینوانید درخواست وام کنید`,
  //       });
  //     }
  //     if (dataCredit.auth == "D") {
  //       user.loanCeiling = 25;
  //       user.creditAuth = true;
  //       user.creditAuthStatus = true;
  //       await user.save();
  //       return res.json({
  //         message: `شما تا سقف 25 میلیون مینوانید درخواست وام کنید`,
  //       });
  //     }
  //   } catch (error) {
  //     res.json({ message: error });
  //   }
  // }
);
// auth register
router.post(
  "/registerauth",
  validator.register(),
  controller.validate,
  firstRegisterStatus,
  (req, res, next) => {
    try {
      let user = req.user;
      fetch("http://localhost:3000/api/auth/test", {
        method: "POST",
        body: JSON.stringify({
          name: req.body.name,
        }),
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.auth) {
            return res.json({
              message: "کد ملی اشتباه",
            });
          }
          next();
        });
    } catch (error) {
      onsole.log("myError" + erroe);
    }
  },
  controller.completeRegister
  // async (req, res, next) => {
  //   try {

  //     console.log(req.body.name);
  //     let user = await User.findOne({ email: req.body.email }); // email = req.body.email
  //     console.log("user: " + user);
  //     if (user) {
  //       res.json({ message: "ا این ایمیل قبلا ثبت نام شده است " });
  //     }
  //     const newUser = new User({
  //       phone1: req.body.phone1,
  //       name: req.body.name,
  //       email: req.body.email,
  //       password: bcrypt.hashSync(req.body.password, 8),
  //     });
  //     await newUser.save();
  //     console.log("salam");
  //     res.json({
  //       message: "ثبت نام با موفقیت انجام شد",
  //       data: {
  //         userName: newUser.name,
  //         userphone1: newUser.phone1,
  //       },
  //     });
  //   } catch (error) {
  //     res.json({ message: error });
  //   }
  // }
);

// ===============test Api========
router.post("/test", (req, res) => {
  // let temp = "xiaomi-13-ultra-5g-dual-sim-1tb-16gb-ram-mobile-phone";
  return res.json({
    auth: "A",
  });
});
router.post("/testauth", (req, res) => {
  return res.json({
    auth: true,
  });
});

// router.post("/login", validator.login(), controller.login);

// //---------admin------
// // update
router.put("/:id", isLoggined, isAdmin, controller.update);
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

// (req, res, next) => {
//   passport.authenticate("local.register", (err, user, info) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     if (!user) {
//       return res.status(400).json({ error: info.message });
//     }

//     // Send a success response back to the client
//     return res.status(200).json({ message: info.message, user: user });
//   })(req, res, next);
// }
// const client = new TrezSMSClient(
//   process.env.SMS_USERNAME,
//   process.env.SMS_PASSWORD
// );
// client
//   .manualSendCode(req.body.phone, `فزنالند\nکد تایید شما: ${randomTest}\n`)
//   .then(async (messageId) => {
//     if (messageId < 2000) {
//       return res.status(500).json({
//         data: {
//           message: "ارسال نشد",
//         },
//       });
//     }
//   });
