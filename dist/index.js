"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var body_parser_1 = __importDefault(require("body-parser"));
var User_1 = require("./User");
var Post_1 = require("./Post");
var Category_1 = require("./Category");
var Comment_1 = require("./Comment");
var EmailValidator = __importStar(require("email-validator"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var app = express_1.default();
var server = http_1.default.createServer(app);
var userArr = [];
var postArr = [];
var categoryArr = [];
var key = 'SuperSecret123';
var postId = 1;
var categoryId = 1;
var commentId = 1;
/*
Find things that need proper ordering
update dates in some functions?
add auth
on submit tell him you used urlencoded
parseInt broken for patching comments?
*/
app.use(body_parser_1.default.urlencoded({ extended: true }));
//app.use(bodyParser.json());
app.get('/', function (req, res, next) {
    res.sendFile(__dirname + '/index.html');
});
app.get('/Users', function (req, res, next) {
    var isAuth = true;
    if (isAuth) {
        res.status(200).json(returnedUsersArr(userArr));
    }
    else if (!isAuth) {
        res.status(401).json({ message: "Unauthorized - Access token is missing or invalid", status: 401 });
    }
});
app.post('/Users', function (req, res, next) {
    var user = new User_1.User();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.userId = req.body.userId;
    user.emailAddress = req.body.emailAddress;
    user.hash(req.body.password);
    if (user.userId.length < 1) {
        res.status(406).json({ message: "Not Acceptable: Bad data in the entity IE: Post must contain a userId", status: 406 });
    }
    else if (!EmailValidator.validate(req.body.emailAddress)) {
        res.status(406).json({ message: "Not Acceptable: Bad data in the entity IE: Incorrectly formatted email address see error message", status: 406 });
    }
    else if (!getByID(user.userId)) {
        userArr.push(user);
        res.status(201).send(user.returnUser());
    }
    else {
        res.status(409).json({ message: 'Conflict, duplicate userId', status: 409 });
    }
});
app.get('/Users/:userId', function (req, res, next) {
    var temp = getByID(req.params.userId);
    var isAuth = true;
    if (isAuth) {
        if (!temp) {
            res.status(404).json({ message: 'User not found', status: 404 });
        }
        else {
            res.status(200).json(temp.returnUser());
        }
    }
    else if (!isAuth) {
        res.status(401).json({ message: "Unauthorized - Access token is missing or invalid", status: 401 });
    }
});
app.patch('/Users/:userId', function (req, res, next) {
    var temp = getByID(req.params.userId);
    var isAuth = true;
    if (isAuth) {
        if (!EmailValidator.validate(req.body.emailAddress)) {
            res.status(406).json({ message: "Not Acceptable: Bad data in the entity IE: Incorrectly formatted email address see error message", status: 406 });
        }
        else if (!temp) {
            res.status(404).json({ message: 'User not found', status: 404 });
        }
        else {
            var user = new User_1.User();
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.userId = req.params.userId;
            user.emailAddress = req.body.emailAddress;
            user.hash(req.body.password);
            updateUserByID(user.userId, user);
            res.status(200).json(user.returnUser());
        }
    }
    else if (!isAuth) {
        res.status(401).json({ message: "Unauthorized - Access token is missing or invalid", status: 401 });
    }
});
app.delete('/Users/:userId', function (req, res, next) {
    var temp = getByID(req.params.userId);
    var isAuth = true;
    if (isAuth) {
        if (!temp) {
            res.status(404).json({ message: 'User not found', status: 404 });
        }
        else {
            removeByID(temp.userId);
            res.status(204).send();
        }
    }
    else if (!isAuth) {
        res.status(401).json({ message: "Unauthorized - Access token is missing or invalid", status: 401 });
    }
});
app.get('/Users/:userId/:password', function (req, res, next) {
    var user = getByID(req.params.userId);
    var isValidPw = "";
    if (user) {
        isValidPw = user.verifyPass(req.params.password, user.hashedPassword);
    }
    if (!user) {
        res.status(401).json({ message: 'Bad username or password', status: 401 });
    }
    else if (!isValidPw) {
        res.status(401).json({ message: 'Bad username or password', status: 401 });
    }
    else {
        res.status(200).json({ token: "We are authed" });
        //TODO GEN TOKEN
        //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    }
});
app.get('/Posts', function (req, res, next) {
    res.status(200).json(returnedPostsArr(postArr));
});
app.post('/Posts', function (req, res, next) {
    var isAuth = true;
    if (isAuth) {
        var post = new Post_1.Post();
        post.postId = postId++;
        post.title = req.body.title;
        post.content = req.body.content;
        post.headerImage = req.body.headerImage;
        post.userId = "3"; //TODO correct user ID from auth header
        if (post.title === undefined || post.content === undefined || post.title.length <= 0 || post.content.length <= 0) {
            res.status(406).json({ message: "Not Acceptable: Bad data in the entity IE: Missing Title or Content", status: 406 });
        }
        else {
            postArr.push(post);
            res.status(201).json(post.returnPost());
        }
    }
    else if (!isAuth) {
        res.status(401).json({ message: "Unauthorized - Access token is missing or invalid", status: 401 });
    }
});
app.get('/Posts/:postId', function (req, res, next) {
    var temp = getPostById(req.params.postId);
    if (temp) {
        res.status(200).json(temp);
    }
    else {
        res.status(404).json({ message: 'Post not found', status: 404 });
    }
});
app.patch('/Posts/:postId', function (req, res, next) {
    var post = getPostById(req.params.postId);
    var isAuth = true;
    if (isAuth) {
        if (post) {
            post.title = req.body.title;
            post.content = req.body.content;
            post.headerImage = req.body.content;
            //UPDATE THE DATEEEEEEE
            //RESORT LIST BASED ON DATE
            res.status(200).json(post.returnPost());
        }
        else {
            res.status(404).json({ message: 'Post not found', status: 404 });
        }
    }
    else if (!isAuth) {
        res.status(401).json({ message: "Unauthorized - Access token is missing or invalid", status: 401 });
    }
});
app.delete('/Posts/:postId', function (req, res, next) {
    var post = getPostById(req.params.postId);
    var isAuth = true;
    if (isAuth) {
        if (post) {
            removePostByID(post.postId);
            res.status(204).send();
        }
        else {
            res.status(404).json({ message: 'Post not found', status: 404 });
        }
    }
    else if (!isAuth) {
        res.status(401).json({ message: "Unauthorized - Access token is missing or invalid", status: 401 });
    }
});
app.get('/Posts/User/:userId', function (req, res, next) {
    var posts = getPostByUser(req.params.userId);
    if (posts.length >= 1) {
        res.status(200).json(returnedPostsArr(posts)); //fix here
    }
    else {
        res.status(404).json({ message: 'Invalid user / no posts found', status: 404 });
    }
});
app.get('/Categories', function (req, res, next) {
    res.status(200).json(categoryArr);
});
app.post('/Categories', function (req, res, next) {
    var isAuth = true;
    if (isAuth) {
        var category = new Category_1.Category();
        category.categoryId = categoryId++;
        category.categoryName = req.body.categoryName;
        category.categoryDescription = req.body.categoryDescription;
        if (isDuplicateCategoryName(category.categoryName)) {
            res.status(409).json({ message: "Conflict, duplicate categoryName", status: 409 });
        }
        else {
            categoryArr.push(category);
            res.status(201).json(category);
        }
    }
    else if (!isAuth) {
        res.status(401).json({ message: "Unauthorized - Access token is missing or invalid", status: 401 });
    }
});
app.get('/Categories/:categoryId', function (req, res, next) {
    var category = getCategoryById(req.params.categoryId);
    if (category) {
        res.status(200).json(category);
    }
    else {
        res.status(404).json({ message: 'Category not Found', status: 404 });
    }
});
app.patch('/Categories/:categoryId', function (req, res, next) {
    var category = getCategoryById(req.params.categoryId);
    var isAuth = true;
    if (isAuth) {
        if (category) {
            if (!isDuplicateCategoryName(req.body.categoryName)) {
                category.categoryName = req.body.categoryName;
                category.categoryDescription = req.body.categoryDescription;
                res.status(200).json(category);
            }
            else {
                res.status(409).json({ message: "Conflict, duplicate categoryName", status: 409 });
            }
        }
        else {
            res.status(404).json({ message: 'Category not Found', status: 404 });
        }
    }
    else if (!isAuth) {
        res.status(401).json({ message: "Unauthorized - Access token is missing or invalid", status: 401 });
    }
});
app.delete('/Categories/:categoryId', function (req, res, next) {
    var category = getCategoryById(req.params.categoryId);
    var isAuth = true;
    if (isAuth) {
        if (category) {
            removeCategoryByID(category.categoryId);
            res.status(204).send();
        }
        else {
            res.status(404).json({ message: 'Category not Found', status: 404 });
        }
    }
    else if (!isAuth) {
        res.status(401).json({ message: "Unauthorized - Access token is missing or invalid", status: 401 });
    }
});
app.get('/PostCategory/:postId', function (req, res, next) {
    var post = getPostById(req.params.postId);
    if (post) {
        res.status(200).send({ postId: post.postId, categories: post.categories });
    }
    else {
        res.status(404).json({ message: "Post not found", status: 404 });
    }
});
app.get('/PostCategory/Posts/:categoryId', function (req, res, next) {
    var category = getCategoryById(req.params.categoryId);
    var posts = getPostsByCategory(category);
    if (category) {
        res.status(200).send({ categoryId: category.categoryId, posts: posts });
    }
    else {
        res.status(404).json({ message: "Category not found", status: 404 });
    }
});
app.post('/PostCategory/:postId/:categoryId', function (req, res, next) {
    var isAuth = true;
    var post = getPostById(req.params.postId);
    var category = getCategoryById(req.params.categoryId); //test
    if (isAuth) {
        if (category && post) {
            post.categories.push(category);
            res.status(201).send("Category Assigned to Post");
        }
        else {
            res.status(404).json({ message: "Category or Post not found", status: 404 });
        }
    }
    else if (!isAuth) {
        res.status(401).json({ message: "Unauthorized - Access token is missing or invalid", status: 401 });
    }
});
app.delete('/PostCategory/:postId/:categoryId', function (req, res, next) {
    var isAuth = true;
    var post = getPostById(req.params.postId);
    var category = getCategoryById(req.params.categoryId); //test
    if (isAuth) {
        if (category && post) {
            removeCategoryFromPost(post.categories, category);
            res.status(204).send();
        }
        else {
            res.status(404).json({ message: "Category or Post not found", status: 404 });
        }
    }
    else if (!isAuth) {
        res.status(401).json({ message: "Unauthorized - Access token is missing or invalid", status: 401 });
    }
});
app.get('/Comments/:postId', function (req, res, next) {
    var post = getPostById(req.params.postId);
    if (post) {
        res.status(200).send(post.comments);
    }
    else {
        res.status(404).json({ message: "Post not found", status: 404 });
    }
});
app.post('/Comments/:postId', function (req, res, next) {
    var isAuth = true;
    var post = getPostById(req.params.postId);
    var comment = new Comment_1.Comment();
    comment.comment = req.body.comment;
    comment.postId = req.params.postId;
    comment.userId = "3"; //TODO @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    comment.commentId = commentId++;
    if (isAuth) {
        if (post) {
            post.comments.push(comment);
            res.status(201).send({ comment: comment, status: 201 });
        }
        else {
            res.status(404).json({ message: "Post not found", status: 404 });
        }
    }
    else if (!isAuth) {
        res.status(401).json({ message: "Unauthorized - Access token is missing or invalid", status: 401 });
    }
});
app.patch('/Comments/:postId/:commentId', function (req, res, next) {
    var isAuth = true;
    var post = getPostById(req.params.postId);
    if (isAuth) {
        if (post) {
            var comment = getCommentFromPost(req.params.commentId, post.comments);
            if (comment) {
                comment.comment = req.body.comment;
                //NEW COMMENT DATE?
                res.status(201).send(comment);
            }
            else {
                res.status(404).json({ message: "Comment or Post not found", status: 404 });
            }
        }
        else {
            res.status(404).json({ message: "Comment or Post not found", status: 404 });
        }
    }
    else if (!isAuth) {
        res.status(401).json({ message: "Unauthorized - Access token is missing or invalid", status: 401 });
    }
});
app.delete('/Comments/:postId/:commentId', function (req, res, next) {
    var isAuth = true;
    var post = getPostById(req.params.postId);
    if (isAuth) {
        if (post) {
            var comment = getCommentFromPost(req.params.commentId, post.comments);
            if (comment) {
                removeCommentFromPost(req.params.commentId, post.comments);
                res.status(204).send();
            }
            else {
                res.status(404).json({ message: "Comment or Post not found", status: 404 });
            }
        }
        else {
            res.status(404).json({ message: "Comment or Post not found", status: 404 });
        }
    }
    else if (!isAuth) {
        res.status(401).json({ message: "Unauthorized - Access token is missing or invalid", status: 401 });
    }
});
server.listen(3000);
function getByID(id) {
    for (var i = 0; i < userArr.length; i++) {
        if (userArr[i].userId === id) {
            return userArr[i];
        }
    }
}
function removeByID(id) {
    for (var i = 0; i < userArr.length; i++) {
        if (userArr[i].userId === id) {
            userArr.splice(i, 1);
        }
    }
}
function updateUserByID(id, user) {
    for (var i = 0; i < userArr.length; i++) {
        if (userArr[i].userId === id) {
            userArr[i] = user;
        }
    }
}
function returnedUsersArr(arr) {
    var userArr = [];
    for (var i = 0; i < arr.length; i++) {
        userArr.push(arr[i].returnUser());
    }
    return userArr;
}
function generateToken(user) {
    var token = jsonwebtoken_1.default.sign(user, key);
    return token;
}
function verifyToken(token, key) {
    return jsonwebtoken_1.default.verify(token, key);
}
function getPostById(postId) {
    for (var i = 0; i < postArr.length; i++) {
        if (postArr[i].postId == postId) {
            return postArr[i];
        }
    }
    return false;
}
function removePostByID(id) {
    for (var i = 0; i < postArr.length; i++) {
        if (postArr[i].postId === id) {
            postArr.splice(i, 1);
            i--;
        }
    }
}
function getPostByUser(userId) {
    var posts = [];
    for (var i = 0; i < postArr.length; i++) {
        if (postArr[i].userId == userId) {
            posts.push(postArr[i]);
        }
    }
    return posts;
}
function getCategoryById(catId) {
    for (var i = 0; i < categoryArr.length; i++) {
        if (categoryArr[i].categoryId == catId) {
            return categoryArr[i];
        }
    }
    return false;
}
function isDuplicateCategoryName(catName) {
    for (var i = 0; i < categoryArr.length; i++) {
        if (categoryArr[i].categoryName == catName) {
            return true;
        }
    }
    return false;
}
function removeCategoryByID(id) {
    for (var i = 0; i < categoryArr.length; i++) {
        if (categoryArr[i].categoryId === id) {
            categoryArr.splice(i, 1);
            i--;
        }
    }
}
function returnedPostsArr(arr) {
    var postArr = [];
    for (var i = 0; i < arr.length; i++) {
        postArr.push(arr[i].returnPost());
    }
    return postArr;
}
function getPostsByCategory(category) {
    //... yikes ... really great code below ...
    var posts = [];
    for (var i = 0; i < postArr.length; i++) {
        for (var j = 0; j < postArr[i].categories.length; j++) {
            if (category.categoryId == postArr[i].categories[j].categoryId) {
                posts.push(postArr[i]);
            }
        }
    }
    return returnedPostsArr(posts);
}
;
function removeCategoryFromPost(categories, category) {
    for (var i = 0; i < categories.length; i++) {
        if (categories[i].categoryId == category.categoryId) {
            categories.splice(i, 1);
            i--;
        }
    }
}
function getCommentFromPost(id, comments) {
    var intId = parseInt(id);
    for (var i = 0; i < comments.length; i++) {
        if (comments[i].commentId == intId) {
            return comments[i];
        }
    }
}
function removeCommentFromPost(id, comments) {
    var intId = parseInt(id);
    for (var i = 0; i < comments.length; i++) {
        if (comments[i].commentId == intId) {
            comments.splice(i, 1);
            i--;
            ;
        }
    }
}
//# sourceMappingURL=index.js.map