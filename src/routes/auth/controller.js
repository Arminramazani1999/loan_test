const controller = require("../controller");
// const User = require("models/user");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

class AuthController extends controller {
  // ==============start OTP=================
  async getPhone(req, res) {
    let user = await this.User.findOne({
      $or: [{ phone1: req.body.phone1 }, { phoneToBy: req.body.phone1 }],
    });
    if (!user) {
      user = await this.User.create({ phone1: req.body.phone1 });
    }
    const https = require("https");
    const data = JSON.stringify({
      to: req.body.phone1,
    });
    const options = {
      hostname: "console.melipayamak.com",
      port: 443,
      path: "/api/send/otp/9c5a76b0fee44649990fbc0943fc1961",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": data.length,
      },
    };
    const getOTPCode = () => {
      return new Promise((resolve, reject) => {
        const a = https.request(options, (res) => {
          let responseData = "";
          res.on("data", (chunk) => {
            responseData += chunk;
          });
          res.on("end", () => {
            const otpCode = JSON.parse(responseData).code;
            resolve(otpCode);
          });
        });
        a.on("error", (error) => {
          reject(error);
        });
        a.write(data);
        a.end();
      });
    };

    getOTPCode()
      .then(async (otpCode) => {
        user.verificationCode = otpCode;
        const now = new Date();
        const dueDate = new Date(now);
        dueDate.setUTCMinutes(now.getUTCMinutes() + 2);
        user.verificationDate = dueDate;
        await user.save();
        return this.response({
          res,
          code: 200,
          data: {
            login_token: req.body.phone1,
            otpCode: otpCode,
          },
        });
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      });
  }
  //verificationCodeInput کد یکبارمصرف
  async verificationCodeInput(req, res) {
    let user = await this.User.findOne({
      $or: [{ phone1: req.body.login_token }, { phoneToBy: req.body.login_token }],
    });
    if (!user) {
      return this.response({
        res,
        code: 404,
        data: {
          message: "کاربر یافت نشد",
        },
      });
    }
    if (!user.verificationCode || user.verificationCode !== req.body.otp) {
      return this.response({
        res,
        message: "کد وارد شده اشتباه است",
      });
    }
    // ====== دو دقیقه اعتبار کد ارسالی
    const verificationDate = user.verificationDate;
    if (verificationDate < new Date()) {
      user.verificationCode = "";
      user.verificationCode = null;
      await user.save();
      return this.response({
        res,
        message: "کد ارسالی منقضی شده است",
      });
    }
    user.verificationCode = "";
    user.verificationCode = null;
    // create token
    const token = jwt.sign({ _id: user.id }, process.env.JWT_KEY, {
      expiresIn: "1d",
    });
    await user.save();
    user = await this.User.findById({ _id: user.id })
      .select("name phone1 email createdAt")
      .lean();
    return this.response({
      res,
      message: "یوزر لاگین شد",
      data: {
        user: user,
        token: token,
      },
    });
  }
  // ==============end OTP=================

  // first register
  async register(req, res) {
    try {
      let user = req.user;
      user = await this.User.findOne({ nationalCode: req.body.nationalCode });
      if (user) {
        return this.response({
          res,
          code: 404,
          data: {
            message: "کاربر قبلا ثبت شده است",
          },
        });
      }
      user = req.user;
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.phone2 = req.body.phone2;
      user.nationalCode = req.body.nationalCode;
      user.firstRegister = true;
      user.firstRegisterStatus = true;
      await user.save();
      return this.response({
        res,
        message: "ثبت نام با موفقیت انجام شد",
      });
    } catch (error) {
      res.json({ message: error });
    }
  }
  // ColleagueRegisterLegal حقوقی
  async ColleagueRegisterLegal(req, res) {
    try {
      let user = req.user;
      // user = await this.User.findOne({ nationalCode: req.body.nationalCode });
      // if (user) {
      //   return this.response({
      //     res,
      //     code: 404,
      //     data: {
      //       message: "کاربر قبلا با این کد ملی ثبت شده است",
      //     },
      //   });
      // }
      user = req.user;
      user.legal = true;
      user.phone2 = req.body.phone2;
      user.companyName = req.body.companyName;
      user.nationalId = req.body.nationalId;
      user.roleCode = req.body.roleCode;
      user.email = req.body.email;
      user.landlinephone = req.body.landlinephone;
      user.sellingType = req.body.sellingType;
      user.state = req.body.state;
      user.city = req.body.city;
      user.companyType = req.body.companyType;
      user.ownershipTyoe = req.body.ownershipTyoe;
      user.address = req.body.address;
      user.postalCode = req.body.postalCode;
      user.addressBuilding = req.body.addressBuilding;
      await user.save();
      return this.response({
        res,
        message: "ثبت نام با موفقیت انجام شد",
      });
    } catch (error) {
      res.json({ message: error });
    }
  }
  //ColleagueRegisterGenuine حقیقی
  async ColleagueRegisterGenuine(req, res) {
    try {
      let user = req.user;
      user = await this.User.findOne({ nationalCode: req.body.nationalCode });
      if (user) {
        return this.response({
          res,
          code: 404,
          data: {
            message: "کاربر قبلا با این کد ملی ثبت شده است",
          },
        });
      }
      user = req.user;
      user.genuine = true;
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.nationalCode = req.body.nationalCode;
      user.roleCode = req.body.roleCode;
      user.tradeId = req.body.tradeId;
      user.email = req.body.email;
      user.sellingType = req.body.sellingType;
      user.state = req.body.state;
      user.city = req.body.city;
      user.address = req.body.address;
      user.PostalCode = req.body.PostalCode;
      user.phone2 = req.body.phone2;
      await user.save();
      return this.response({
        res,
        message: "ثبت نام با موفقیت انجام شد",
      });
    } catch (error) {
      res.json({ message: error });
    }
  }
  // creditAuth
  async creditAuth(req, res) {
    try {
      let user = req.user;
      if (dataCredit.auth == "A") {
        user.loanCeiling = 100000000;
        user.creditAuth = true;
        user.creditAuthStatus = true;
        await user.save();
        return this.response({
          res,
          message: `شما تا سقف ۱۰۰ میلیون مینوانید درخواست وام کنید`,
        });
      }
      if (dataCredit.auth == "B") {
        user.loanCeiling = 75000000;
        user.creditAuth = true;
        user.creditAuthStatus = true;
        await user.save();
        return this.response({
          res,
          message: `شما تا سقف 75 میلیون مینوانید درخواست وام کنید`,
        });
      }
      if (dataCredit.auth == "C") {
        user.loanCeiling = 50000000;
        user.creditAuth = true;
        user.creditAuthStatus = true;
        await user.save();
        return this.response({
          res,
          message: `شما تا سقف 50 میلیون مینوانید درخواست وام کنید`,
        });
      }
      if (dataCredit.auth == "D") {
        user.loanCeiling = 25000000;
        user.creditAuth = true;
        user.creditAuthStatus = true;
        await user.save();
        return this.response({
          res,
          message: `شما تا سقف 25 میلیون مینوانید درخواست وام کنید`,
        });
      }
    } catch (error) {
      res.json({ message: error });
    }
  }
  async completeRegister(req, res) {
    try {
      let user = req.user;
      // user.phone1 = req.body.phone1;
      user.phone2 = req.body.phone2;
      user.nationalCode = req.body.nationalCode;
      user.name = req.body.name;
      user.firstRegister = true;
      user.firstRegisterStatus = true;
      await user.save();
      return this.response({
        res,
        message: "ثبت نام با موفقیت انجام شد",
      });
    } catch (error) {
      res.json({ message: error });
    }
  }

  // show all
  async getAll(req, res) {
    let user = await this.User.find({});
    this.response({
      res,
      message: "All:",
      data: { user },
    });
  }
  // see one
  async seeOne(req, res) {
    let user = await this.User.findById(req.params.id);
    if (!user) {
      this.response({
        res,
        code: 404,
        message: "کاربر وجود ندارد",
      });
    }
    this.response({
      res,
      message: "see one",
      data: { user },
    });
  }
  // delete
  async delete(req, res) {
    let user = await this.User.findById(req.params.id);
    if (!user) {
      this.response({
        res,
        code: 404,
        message: "کاربر وجود ندارد",
      });
    }
    user = await this.User.findByIdAndDelete(req.params.id);
    this.response({
      res,
      message: "کاربر حذف شد",
      data: { user },
    });
  }
  //update
  async update(req, res) {
    let user = await this.User.findById(req.params.id);
    if (!user) {
      this.response({
        res,
        code: 404,
        message: "کاربر وجود ندارد",
      });
    }
    user = await this.User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    this.response({
      res,
      message: "کاربر بروز شد",
      data: { user },
    });
  }
}

module.exports = new AuthController();

// حقوقی:
// email
// companyName // نام شرکت
// nationalId//شناسه ملی شرکت
// roleCode; //کدنقش
// sellingType; //نوع فروش
// state; // استان
// city; // شهر
// address; // آدرس
// addressBuilding; //ادرس ساختمان : پلاک-طبقه
// PostalCode; // کدپستی
// landlinephone // تلفن ثابت
// Description; // توضیحات
// companyType//نوع شرکت
// ownershipTyoe//نوع مالکیت
// phone1//شماره موبایل دوم

// user.nationalId = req.body.nationalId;
// user.roleCode = req.body.roleCode;
// user.email = req.body.email;
// user.landlinephone = req.body.landlinephone;
// user.sellingType = req.body.sellingType;
// user.state = req.body.state;
// user.city = req.body.city;
// user.companyType = req.body.companyType;
// user.ownershipTyoe = req.body.ownershipTyoe;

// async getPhone(req, res) {
//     let user = await this.User.findOne({ phone1: req.body.phone1 });
//     if (!user) {
//       user = await this.User.create({ phone1: req.body.phone1 });
//     }

//     const https = require("https");
//     const data = JSON.stringify({
//       to: req.body.phone1,
//     });
//     const options = {
//       hostname: "console.melipayamak.com",
//       port: 443,
//       path: "/api/send/otp/9c5a76b0fee44649990fbc0943fc1961",
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Content-Length": data.length,
//       },
//     };

//     const getOTPCode = () => {
//       return new Promise((resolve, reject) => {
//         const a = https.request(options, (res) => {
//           let responseData = "";
//           res.on("data", (chunk) => {
//             responseData += chunk;
//           });
//           res.on("end", () => {
//             const otpCode = JSON.parse(responseData).code;
//             resolve(otpCode);
//           });
//         });
//         a.on("error", (error) => {
//           reject(error);
//         });
//         a.write(data);
//         a.end();
//       });
//     };

//     // هر 1 دقیقه یک بار اجرا شود
//     cron.schedule("*/1 * * * *", async () => {
//       try {
//         const otpCode = await getOTPCode();
//         user.verificationCode = otpCode;
//         const now = new Date();
//         const dueDate = new Date(now);
//         dueDate.setUTCMinutes(now.getUTCMinutes() + 2);
//         user.verificationDate = dueDate;
//         await user.save();

//         return this.response({
//           res,
//           code: 200,
//           data: {
//             login_token: user.phone1,
//             otpCode: otpCode,
//           },
//         });
//       } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: "Internal Server Error" });
//       }
//     });
//   }
