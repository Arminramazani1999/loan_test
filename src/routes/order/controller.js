const controller = require("../controller");
const path = require("path");
const { validationResult } = require("express-validator");
const user = require("../../models/user");
const loan = require("../../models/loan");
const { v5: uuidv5 } = require("uuid");
const Order = require("../../models/order");
class OrderController extends controller {
  // create
  async create(req, res) {
    let user = req.user;
    let amount = req.body.amount;
    if (Number(amount) > user.loanCeiling) {
      return this.response({
        res,
        message: "شما مجاز برای گرفتن این مبلغ وام نیستید ",
        data: `مبلغ مجاز شما ${user.loanCeiling}`,
      });
    }
    const loan = new this.Loan({
      amount: req.body.amount,
    });
    await loan.save();
    // unique code
    const _ = require("lodash");
    const randomTemp = _.random(10000, 99999);
    let order = await this.Order.findOne({ uniqueCode: randomTemp });
    while (order) {
      randomTemp = _.random(10000, 99999);
      order = await this.Order.findOne({ uniqueCode: randomTemp });
    }
    //=======
    // async function generateUniqueOrderCode() {
    //   let orderCode;
    //   let order;

    //   do {
    //     // تولید کد یکتای ۱۵ کاراکتری
    //     orderCode = uuidv5(uuidv5(Date.now().toString()), "order-").substring(
    //       0,
    //       15
    //     );
    //     // orderCode = uuidv4();
    //     order = await Order.findOne({ uniqueCode: orderCode });
    //   } while (order);

    //   return orderCode;
    // }
    console.log("user:", user.orderUser);
    order = new this.Order({
      // uniqueCode: await generateUniqueOrderCode(),
      loan: loan.id,
      user: user.id,
      uniqueCode: randomTemp,
      receivingDate: new Date(),
    });
    await order.save();
    console.log(order.receivingDate);
    user.credit = loan.amount;
    user.orderUser = true;
    await user.save();
    this.response({
      res,
      message: "با موفقیت ثبت شد",
      data: `اعتبار شما به مبلغ ${user.credit}`,
    });
  }

  // show all
  async getAll(req, res) {
    let orderList = await this.Order.find({})
      .populate("user")
      .populate("loan")
      .sort({ dateOrdered: -1 });
    if (!orderList) {
      this.response({
        res,
        code: 404,
        message: "سفارشی وجود ندارد",
      });
    }

    this.response({
      res,
      message: "All:",
      data: { orderList },
    });
  }
  // detaile
  async seeOne(req, res) {
    let order = await this.Order.findById(req.params.id)
      .populate("user")
      .populate("loan");
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
    let order = await this.Order.findById(req.params.id);
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
    const userOrderList = await Order.find({ user: user.id })
      .populate("user")
      .populate("loan")
      .sort({ createdAt: -1 });
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
