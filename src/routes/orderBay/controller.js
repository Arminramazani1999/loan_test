const controller = require("../controller");
const path = require("path");
// const User = require("models/user");
const { validationResult } = require("express-validator");
const user = require("../../models/user");
const _ = require("lodash");
const loan = require("../../models/loan");
const OrderBay = require("../../models/order-by");
const order = require("../../models/order");
const DepositList = require("../../models/depositList");
const cron = require("node-cron");

class OrderController extends controller {
  //=====ckeck
  async checkDueDates(req, res, next) {
    let user = req.user;
    const now = new Date();
    let orderBay = await OrderBay.find({
      user: user.id,
      statusOrderBy: false,
      paymentDate: { $lte: now },
    });

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

  //======create
  async create(req, res) {
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
      debtAmount: req.body.price,
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
    user.credit = user.credit - orderBay.debtAmount;
    user.debt = orderBay.debtAmount + user.debt;
    user.debtStatus = false;
    // // هر 5 دقیقه یک بار اجرا شود
    // cron.schedule("*/1 * * * *", () => {
    //   console.log("کار زمان‌بندی شده اجرا شد!");
    //   // کد مورد نظر خود را اینجا قرار دهید
    // });
    await user.save();
    this.response({
      res,
      message: "خرید با موفقیت ثبت شد",
      data: orderBay,
    });
  }

  //=======Total const of debt
  async totalDebt(req, res) {
    let user = req.user;
    let totaldebt = 0;
    let orderBay = await OrderBay.find({ user: user.id, statusOrderBy: false });
    //  خریدهایی که بدهکار ان
    orderBay.map((orderBayTemp) => {
      totaldebt = orderBayTemp.debtAmount + totaldebt; // 5+0 =5
      // orderBayTemp.statusOrderBy=true;
      // orderBayTemp.save();
      console.log("BY2", orderBayTemp.statusOrderBy, orderBayTemp.debtAmount);
    });
    if (totaldebt == 0) {
      if (!user.debtStatus || !user.checkDueDatesUser) {
        user.debtStatus = true;
        user.checkDueDatesUser = true;
        user.isCreditActive = true;
      }
    }
    user.debt = totaldebt;
    user.save();
    this.response({
      res,
      message: "کل مبلغ بدهی",
      data: { totaldebt: user.debt },
    });
  }

  //====== Amount
  async amount(req, res) {
    let user = req.user;
    // بررسی وجود قیمت برای واریز
    if (!req.body.deposit) {
      return this.response({
        res,
        message: "واریزی وجود ندارد",
      });
    }
    // بررسی وجود بدهی
    if (req.body.deposit > user.debt) {
      if (user.debt == 0) {
        return this.response({
          res,
          message: "شما هنوز بدهی ندارید",
        });
      }
      return this.response({
        res,
        message: "واریزی شما بیشتر از بدهی که دارید",
      });
    }
    //به لیست واریزی ها اضافه میشود
    const depositList = new this.DepositList({
      user: user.id,
      deposit: req.body.deposit,
    });
    await depositList.save();
    let depositTemp = req.body.deposit;
    const orderBay = await OrderBay.find({
      user: user.id,
      statusOrderBy: false,
    });
    // بررسی خریدهای بدهکار
    for await (const orderBayTemp of orderBay) {
      //=====if-1
      if (orderBayTemp.debtAmount > depositTemp) {
        // واریزی هایی که کوچکتر از خرید هستند در این فیلد جمع میشوند که بعدا به اعتبار اضافه شوند
        user.temporaryDepositSum =
          Number(depositTemp) + Number(user.temporaryDepositSum);
        orderBayTemp.debtAmount = orderBayTemp.debtAmount - depositTemp;
        await orderBayTemp.save();
        await user.save();
        depositTemp = 0;
        return this.response({
          res,
          message: `واریزی ثبت شد | ${depositTemp}`,
          data: { loan_total_debtAmount: orderBayTemp.debtAmount },
        });
        //========if-2
      } else if (orderBayTemp.debtAmount == depositTemp) {
        if (user.temporaryDepositSum > 0) {
          user.credit =
            Number(user.credit) +
            Number(user.temporaryDepositSum) +
            Number(depositTemp);
        } else if (user.temporaryDepositSum == 0) {
          user.credit = Number(user.credit) + Number(depositTemp);
        }
        user.temporaryDepositSum = 0;

        await user.save();
        orderBayTemp.debtAmount = 0;
        orderBayTemp.statusOrderBy = true;
        await orderBayTemp.save();
        depositTemp = 0;
        return this.response({
          res,
          message: `واریزی ثبت شد ${depositTemp}`,
          data: { loan_total_debtAmount: orderBayTemp.debtAmount },
        });
        //=======if-3
      } else {
        depositTemp = depositTemp - orderBayTemp.debtAmount;
        if (user.temporaryDepositSum > 0) {
          user.credit =
            Number(user.credit) +
            Number(user.temporaryDepositSum) +
            Number(orderBayTemp.debtAmount);
        } else if (user.temporaryDepositSum == 0) {
          user.credit = Number(user.credit) + Number(orderBayTemp.debtAmount);
        }
        await user.save();
        user.temporaryDepositSum = 0;
        orderBayTemp.debtAmount = 0;
        orderBayTemp.statusOrderBy = true;
        await orderBayTemp.save();
      }
    }

    // orderBay.forEach(async (orderBayTemp) => {
    //   //=====if-1
    //   if (orderBayTemp.price > depositTemp) {
    //     // واریزی هایی که کوچکتر از خرید هستند در این فیلد جمع میشوند که بعدا به اعتبار اضافه شوند
    //     user.temporaryDepositSum =
    //       Number(depositTemp) + Number(user.temporaryDepositSum);
    //     orderBayTemp.price = orderBayTemp.price - depositTemp;
    //     user.save();
    //     orderBayTemp.save();
    //     depositTemp = 0;
    //     return this.response({
    //       res,
    //       message: `واریزی ثبت شد | ${depositTemp}`,
    //       data: { loan_total_price: orderBayTemp.price },
    //     });
    //     //========if-2
    //   } else if (orderBayTemp.price == depositTemp) {
    //     if (user.temporaryDepositSum > 0) {
    //       user.credit =
    //         Number(user.credit) +
    //         Number(user.temporaryDepositSum) +
    //         Number(depositTemp);
    //     } else if (user.temporaryDepositSum == 0) {
    //       user.credit = Number(user.credit) + Number(depositTemp);
    //     }
    //     user.temporaryDepositSum = 0;
    //     user.save();
    //     orderBayTemp.price = 0;
    //     orderBayTemp.statusOrderBy = true;
    //     orderBayTemp.save();
    //     depositTemp = 0;
    //     return this.response({
    //       res,
    //       message: `واریزی ثبت شد ${depositTemp}`,
    //       data: { loan_total_price: orderBayTemp.price },
    //     });
    //     //=======if-3
    //   } else {
    //     depositTemp = depositTemp - orderBayTemp.price;
    //     if (user.temporaryDepositSum > 0) {
    //       user.credit =
    //         Number(user.credit) +
    //         Number(user.temporaryDepositSum) +
    //         Number(depositTemp);
    //     } else if (user.temporaryDepositSum == 0) {
    //       user.credit = Number(user.credit) + Number(orderBayTemp.price);
    //     }
    //     user.save();
    //     user.temporaryDepositSum = 0;
    //     orderBayTemp.price = 0;
    //     orderBayTemp.statusOrderBy = true;
    //     orderBayTemp.save();
    //   }
    // });
  }
  // async farnaaPay(req, res) {
  //   this.User;
  // }
  // show all
  async getAll(req, res) {
    let orderByList = await OrderBay.find({})
      .populate("user")
      .sort({ createdAt: -1 });
    if (!orderByList) {
      this.response({
        res,
        code: 404,
        message: "سفارشی وجود ندارد",
      });
    }
    // لیست خرید
    this.response({
      res,
      message: "لیست خرید:",
      data: { orderByList },
    });
  }
  // detaile
  async seeOne(req, res) {
    let order = await this.Order.findById(req.params.id).populate([
      "user",
      {
        path: "orderItem",
        populate: { path: "product", populate: "category" },
      },
    ]);
    if (!order) {
      this.response({
        res,
        code: 404,
        message: "سفارشی وجود ندارد",
      });
    }
    this.response({
      res,
      message: "",
      data: { order },
    });
  }
  // delete
  async delete(req, res) {
    let order = await OrderBay.findById(req.params.id);
    if (!order) {
      this.response({
        res,
        code: 404,
        message: "سفارشی وجود ندارد",
      });
    }
    order = await this.Order.findByIdAndDelete(req.params.id);
    this.response({
      res,
      message: " سفارش حذف شد",
      data: { order },
    });
  }

  // get totalsales
  async getTotalSales(req, res) {
    const totalSales = await this.Order.aggregate([
      { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
    ]);
    if (!totalSales) {
      this.response({
        res,
        code: 400,
        message: "The order sales connot be generated",
      });
    }
    res.send({
      totalsales: totalSales.pop().totalsales,
    });
  }
  // get count
  async getCount(req, res) {
    const orderCount = await this.Order.countDocuments();
    if (!orderCount) {
      this.response({
        res,
        code: 500,
        message: " سفارشی وجود ندارد",
      });
    }
    res.send({
      orderCount: orderCount,
    });
  }
  // get user orders
  async getUserOrders(req, res) {
    const userOrderList = await this.Order.find({ user: req.params.id })
      .populate([
        {
          path: "orderItem",
          populate: { path: "product", populate: "category" },
        },
      ])
      .sort({ dateOrdered: -1 });
    if (!userOrderList) {
      this.response({
        res,
        code: 500,
        message: " سفارشی وجود ندارد",
      });
    }
    res.send({
      userOrderList: userOrderList,
    });
  }

  //update
  async update(req, res) {
    let order = await this.Order.findById(req.params.id);
    if (!order) {
      this.response({
        res,
        code: 404,
        message: "سفارشی وجود ندارد",
      });
    }
    order = await this.Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    this.response({
      res,
      message: "سفارش بروز شد",
      data: { order },
    });
  }
}

module.exports = new OrderController();

// orderBay.forEach((orderBayTemp) => {
//   //=====if-1
//   if (orderBayTemp.price > depositTemp) {
//     // واریزی هایی که کوچکتر از خرید هستند در این فیلد جمع میشوند که بعدا به اعتبار اضافه شوند
//     user.temporaryDepositSum =
//       Number(depositTemp) + Number(user.temporaryDepositSum);
//     orderBayTemp.price = orderBayTemp.price - depositTemp;
//     user.save();
//     orderBayTemp.save();
//     depositTemp = 0;
//     return this.response({
//       res,
//       message: `واریزی ثبت شد | ${depositTemp}`,
//       data: { loan_total_price: orderBayTemp.price },
//     });
//     //========if-2
//   } else if (orderBayTemp.price == depositTemp) {
//     if (user.temporaryDepositSum > 0) {
//       user.credit =
//         Number(user.credit) +
//         Number(user.temporaryDepositSum) +
//         Number(depositTemp);
//     } else if (user.temporaryDepositSum == 0) {
//       user.credit = Number(user.credit) + Number(depositTemp);
//     }
//     user.temporaryDepositSum = 0;

//     user.save();
//     orderBayTemp.price = 0;
//     orderBayTemp.statusOrderBy = true;
//     orderBayTemp.save();
//     depositTemp = 0;
//     return this.response({
//       res,
//       message: `واریزی ثبت شد ${depositTemp}`,
//       data: { loan_total_price: orderBayTemp.price },
//     });
//     //=======if-3
//   } else {
//     depositTemp = depositTemp - orderBayTemp.price;
//     if (user.temporaryDepositSum > 0) {
//       user.credit =
//         Number(user.credit) +
//         Number(user.temporaryDepositSum) +
//         Number(depositTemp);
//     } else if (user.temporaryDepositSum == 0) {
//       user.credit = Number(user.credit) + Number(orderBayTemp.price);
//     }
//     user.save();
//     user.temporaryDepositSum = 0;
//     orderBayTemp.price = 0;
//     orderBayTemp.statusOrderBy = true;
//     orderBayTemp.save();
//   }
// });
