const controller = require("../controller");
// const User = require("../../models/user");
const { validationResult } = require("express-validator");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");
const Order = require("../../models/order");
const OrderBy = require("../../models/order-by");
const timestampsPlugin = require("mongoose-timestamp");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);

class AuthController extends controller {
  async dashboard(req, res) {
    let user = req.user;
    console.log(user.loanCeiling);
    // user.firstRegister = true;
    // user.credit = 20;
    // user.save();
    const userOrderByList = await OrderBy.find({
      user: user.id,
      statusOrderBy: false,
    })
      .select("statusOrderBy debtAmount priceBy createdAt")
      .sort({
        createdAt: -1,
      })
      .lean();
    const userOrderList = await Order.find({ user: user.id })
      .populate(
        "user",
        "name phone1 nationalCode contractDate loanCeiling credit debt createdAt"
      )
      .populate("loan");

    if (userOrderList.length && userOrderByList.length) {
      return this.response({
        res,
        message: " داشبورد  ",
        data: {
          userOrderList: userOrderList,
          userOrderByList: userOrderByList,
        },
      });
    } else if (userOrderList.length) {
      return this.response({
        res,
        message: " داشبورد  ",
        data: { userOrderList: userOrderList },
      });
    }
    // تبدیل تاریخ و زمان به فرمت محلی
    const localDateTime = dayjs(user.updatedAt)
      .tz("Asia/Tehran")
      .format("YYYY-MM-DD HH:mm:ss");

    console.log(localDateTime);
    // user = await this.User.findOne({ id: req.user.id });
    user = await this.User.findById({ _id: user.id })
      .select(
        "name phone1 nationalCode contractDate loanCeiling credit debt createdAt"
      )
      .lean();
    return this.response({
      res,
      message: " داشبورد سفارشی وجود ندارد ",
      data: {
        user: user,
      },
    });
  }

  async profile(req, res) {
    let user = req.user;
    user = await this.User.findById({ _id: user.id })
      .select(
        "-password -orderUser -orderBayUser -firstRegister -verificationDate -verificationCode -creditAuth -auth -firstRegisterStatus -creditStatus -debtStatus -authStatus -isCreditActive -permanentCreditStatus -temporaryCreditStatus -farnaaPayUserStatus -checkDueDatesUser -temporaryDepositSum -isAdmin"
      )
      .lean();
    if (user.legal) {
      return this.response({
        res,
        message: "profile حقوقی",
        data: {
          user: user,
        },
      });
    }
    if (user.genuine) {
      return this.response({
        res,
        message: "profile حقیقی",
        data: {
          user: user,
        },
      });
    }
    return this.response({
      res,
      message: "profile",
      data: {
        user: user,
      },
    });
  }

  //  me
  async me(req, res) {
    const user = req.user;
    this.respons({
      res,
      data: {
        name: user.name,
        // email: user.email,
      },
    });
  }
}

module.exports = new AuthController();
