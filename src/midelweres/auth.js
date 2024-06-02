const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("./../models/user");

// is logined
async function isLoggined(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    let token;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
    // 1. بررسی وجود توکن در هدر
    // const token = req.header("x-auth-token");
    // const token = req.header("Token");
    if (!token) {
      res.status(401).send("توکنی وجود ندارد");
    }
    // 2. تأیید توکن
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    // 3. پیدا کردن کاربر
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).send("کاربر یافت نشد");
    }
    // 4. افزودن کاربر به درخواست
    req.user = user;
    next();
  } catch (ex) {
    // 5. مدیریت خطاها
    console.error("خطا در بررسی توکن:", ex);
    res.status(400).send("توکن نا معتبر است");
  }
}
// is admin
async function isAdmin(req, res, next) {
  if (!req.user.isadmin) {
    res.status(403).send("is not admin");
  }
  next();
}

//firstRegister
async function firstRegister(req, res, next) {
  if (req.user.firstRegister) {
    res.status(403).send("ثبت نام اولیه شده است");
  }
  next();
}
//firstRegisterStatus
async function firstRegisterStatus(req, res, next) {
  if (!req.user.firstRegisterStatus) {
    res.status(403).send("ثبت نام اولیه نشده است");
  }
  next();
}

//creditAuth
async function creditAuth(req, res, next) {
  if (req.user.creditAuth) {
    res.status(403).send("کاربر قبلا اعتبار سنجی شده است");
  }
  next();
}
//creditAuthStatus
async function creditAuthStatus(req, res, next) {
  if (!req.user.creditAuthStatus) {
    res.status(403).send("کاربر اعتبار سنجی نشده است");
  }
  next();
}

//درخواست وام
async function creditStatus(req, res, next) {
  if (!req.user.creditStatus) {
    res.status(403).send("کاربر اعتبار نگرفته است");
  }
  next();
}
//orderUser
async function orderUser(req, res, next) {
  if (req.user.orderUser) {
    res.status(403).send("کاربر قبلا اعتبار گرفته است");
  }
  next();
}

//orderBayUser
async function orderBayUser(req, res, next) {
  if (!req.user.orderBayUser) {
    res.status(403).send("به دلیل عدم پرداخت ");
  }
  next();
}

//farnaaPayUserStatus
async function farnaaPayUserStatus(req, res, next) {
  if (!req.user.farnaaPayUserStatus) {
    res.status(403).send("کاربر شرایط ورود به فرناپی را ندارد");
  }
  next();
}
//isGenuine
async function isGenuine(req, res, next) {
  if (!req.user.genuine) {
    res.status(403).send("کاربر ثبتنام حقیقی کرده است");
  }
  next();
}
//isLegal
async function isLegal(req, res, next) {
  if (!req.user.legal) {
    res.status(403).send("کاربر ثبتنام حقوقی کرده است");
  }
  next();
}

module.exports = {
  isLoggined,
  isAdmin,
  firstRegister,
  orderUser,
  orderBayUser,
  creditAuth,
  firstRegisterStatus,
  creditAuthStatus,
  creditStatus,
  farnaaPayUserStatus,
};
