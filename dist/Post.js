"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
var ReturnPost_1 = require("./ReturnPost");
var Post = /** @class */ (function () {
    function Post() {
        this.postId = 0;
        this.createdDate = new Date(); //Verify this works
        this.title = "";
        this.content = "";
        this.userId = "";
        this.headerImage = "";
        this.lastUpdated = new Date();
        this.categories = [];
        this.comments = [];
    }
    Post.prototype.returnPost = function () {
        var returnPost = new ReturnPost_1.ReturnPost();
        returnPost.postId = this.postId;
        returnPost.createdDate = this.createdDate;
        returnPost.title = this.title;
        returnPost.content = this.content;
        returnPost.userId = this.userId;
        returnPost.headerImage = this.headerImage;
        returnPost.lastUpdated = this.lastUpdated;
        return returnPost;
    };
    return Post;
}());
exports.Post = Post;
//# sourceMappingURL=Post.js.map