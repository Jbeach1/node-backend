"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
var Post = /** @class */ (function () {
    function Post() {
        this.postId = "";
        this.createdDate = new Date(); //Verify this works
        this.title = "";
        this.content = "";
        this.userId = "";
        this.headerImage = "";
        this.lastUpdated = new Date();
    }
    return Post;
}());
exports.Post = Post;
//# sourceMappingURL=Post.js.map