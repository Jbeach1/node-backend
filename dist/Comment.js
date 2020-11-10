"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
var Comment = /** @class */ (function () {
    function Comment() {
        this.commentId = ""; //number?
        this.comment = "";
        this.userId = "";
        this.postId = "";
        this.commentDate = new Date(); //todo make hashed
    }
    return Comment;
}());
exports.Comment = Comment;
//# sourceMappingURL=Comment.js.map