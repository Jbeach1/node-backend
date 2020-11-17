"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var ReturnUser_1 = require("../ReturnUser");
var User = /** @class */ (function () {
    function User() {
        this.userId = "";
        this.firstName = "";
        this.lastName = "";
        this.emailAddress = "";
        this.password = ""; //todo make hashed
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
    return User;
}());
exports.User = User;
//# sourceMappingURL=User.js.map