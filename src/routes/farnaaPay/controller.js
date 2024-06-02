const controller = require("../controller");
const OrderBay = require("../../models/order-by");

class FarnaaPayController extends controller {
  // ==============start OTP=================
  async getPhone(req, res) {
    let user = await this.User.findOne({ phoneToBy: req.body.phone1 });
    if (!user) {
      return this.response({
        res,
        code: 404,
        data: {
          message: "کاربر یافت نشد",
        },
      });
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
      .then((otpCode) => {
        user.verificationCode = otpCode;
        const now = new Date();
        const dueDate = new Date(now);
        dueDate.setUTCMinutes(now.getUTCMinutes() + 2);
        user.verificationDate = dueDate;
        user.save();
        return this.response({
          res,
          code: 200,
          data: {
            login_token: user.phoneToBy,
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
    let user = await this.User.findOne({ phoneToBy: req.body.login_token });
    if (!user) {
      return this.response({
        res,
        code: 404,
        data: {
          message: "کاربر یافت نشد",
        },
      });
    }
    if (!user.verificationCode || user.verificationCode !== req.body.code) {
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
      user.farnaaPayUserStatus = true;
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
    return this.response({
      res,
      message: "یوزر لاگین شد",
      data: { "token": token },
    });
  }
  // ==============end OTP=================

  //=====ckeck
  async checkDueDates(req, res, next) {
    let user = req.user;
    const now = new Date();
    let orderBay = await OrderBay.find({
      user: user.id,
      statusOrderBy: false,
      paymentDate: { $lte: now },
    });
    console.log(now, "\n", orderBay.paymentDate);

    if (orderBay.length > 0) {
      user.checkDueDates = false;
      user.isCreditActive = false;
      user.save();
      return this.response({
        res,
        message:
          "به دلیل عدم پرداخت بدهی در زمان تعیین شده شما مجاز به خرید نمیباشید",
        data: orderBay,
      }); // This will log all orders with a dueDate greater than the current date and time
    }
    if (!user.checkDueDates) {
      user.checkDueDates = true;
      user.save();
    }
    next();
  }

  //======Pay
  async pay(req, res) {
    let user = req.user;
    
    if (user.credit < req.body.price) {
      return this.response({
        res,
        message: "موجودی کافی نمیباشد",
        data: { user_credit: user.credit },
      });
    }
    const randomTemp = _.random(10000, 99999);
    let orderBay = await OrderBay.findOne({ uniqueCode: randomTemp });
    while (orderBay) {
      randomTemp = _.random(10000, 99999);
      orderBay = await OrderBay.findOne({ uniqueCode: randomTemp });
    }
    orderBay = new OrderBay({
      user: user.id,
      uniqueCode: randomTemp,
      price: req.body.price,
      priceBy: req.body.price,
      receivingDate: new Date(),
    });
    //              ============Adding 5 days for due date========
    const nowTemp = orderBay.receivingDate;
    const dueDate = new Date(nowTemp);
    dueDate.setUTCMinutes(nowTemp.getUTCMinutes() + 10); // Adding 5 days for due date
    orderBay.paymentDate = dueDate;
    await orderBay.save();
    // اعتبار
    user.credit = user.credit - orderBay.price;
    user.debt = orderBay.price;
    user.debtStatus = false;
    user.farnaaPayUserStatus = false;
    await user.save();
    this.response({
      res,
      message: "خرید با موفقیت ثبت شد",
      data: orderBay,
    });
  }
}
module.exports = new FarnaaPayController();
