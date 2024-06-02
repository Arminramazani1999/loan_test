const controller = require("../controller");
// const User = require("models/user");
const { validationResult } = require("express-validator");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");
const Loan = require("../../models/loan");

class ProductController extends controller {
  // create
  async create(req, res) {
    let loan = await Loan.findOne({ amount: req.body.amount });
    if (loan) {
      return this.response({
        res,
        code: 400,
        message: "وام قبلا وجود دارد",
      });
    }
    loan = new Loan({
      amount: req.body.amount
    });

    await loan.save();
    this.response({
      res,
      message: "وام با موفقیت ثبت شد",
      data: { loan },
    });
  }
  // show all
  async getAll(req, res) {
    let loan = await Loan.find({});

    this.response({
      res,
      message: "",
      data: { loan },
    });
  }
  // see one
  async seeOne(req, res) {
    let product = await this.Product.findById(req.params.id);
    if (!product) {
      this.response({
        res,
        code: 404,
        message: " محصول وجود ندارد",
      });
    }
    // view++
    product.view += 1;
    await product.save();
    this.response({
      res,
      message: "",
      data: { product },
    });
  }
  // delete
  async delete(req, res) {
    let product = await this.Product.findById(req.params.id);
    if (!product) {
      this.response({
        res,
        code: 404,
        message: " محصول وجود ندارد",
      });
    }
    product = await this.Product.findByIdAndDelete(req.params.id);
    this.response({
      res,
      message: " محصول حذف شد",
      data: { product },
    });
  }
  //update
  async update(req, res) {
    let product = await this.Product.findById(req.params.id);
    if (!product) {
      this.response({
        res,
        code: 404,
        message: " محصول وجود ندارد",
      });
    }
    product = await this.Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    this.response({
      res,
      message: " محصول حذف شد",
      data: { product },
    });
  }

  async getCount(req, res) {
    const productCount = await this.Product.countDocuments();
    if (!productCount) {
      this.response({
        res,
        code: 404,
        message: " محصولی وجود ندارد",
      });
    }
    res.send({
      productCount: productCount,
    });
  }
  async getFeatured(req, res) {
    const count = req.query.count ? req.query.count : 0;
    const product = await this.Product.find({ isFeatured: true }).limit(+count);
    if (!product) {
      this.response({
        res,
        code: 404,
        message: " محصول برجسته ای وجود ندارد",
      });
    }
    this.response({
      res,
      message: "محصولات برجسته",
      data: { product },
    });
  }
}

module.exports = new ProductController();
