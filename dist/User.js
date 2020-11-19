"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var ReturnUser_1 = require("./ReturnUser");
var bcrypt_1 = __importDefault(require("bcrypt"));
var User = /** @class */ (function () {
    function User() {
        this.userId = "";
        this.firstName = "";
        this.lastName = "";
        this.emailAddress = "";
        this.hashedPassword = "";
    }
    User.prototype.setPw = function (password) {
        this.password = password;
    };
    User.prototype.getPw = function (password) {
        return this.password;
    };
    User.prototype.returnUser = function () {
        var returnUser = new ReturnUser_1.ReturnUser();
        returnUser.userId = this.userId;
        returnUser.firstName = this.firstName;
        returnUser.lastName = this.lastName;
        returnUser.emailAddress = this.emailAddress;
        return returnUser;
    };
    User.prototype.hash = function (password) {
        this.hashedPassword = bcrypt_1.default.hashSync(password, 10);
    };
    User.prototype.verifyPass = function (pw, hashed) {
        if (pw === undefined || hashed === undefined) {
            return false;
        }
        return bcrypt_1.default.compareSync(pw, hashed);
    };
    return User;
}());
exports.User = User;
//# sourceMappingURL=User.js.map