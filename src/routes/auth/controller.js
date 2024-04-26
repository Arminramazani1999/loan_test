const controller = require("../controller");
// const User = require("models/user");
const { validationResult } = require("express-validator");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");

class AuthController extends controller {
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
}

module.exports = new AuthController();