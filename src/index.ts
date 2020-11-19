import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import { User } from './User';
import { ErrorMsg } from './ErrorMsg';
import { Token } from './Token';
import { Post } from './Post';
import { Category } from './Category';
import { Comment } from './Comment';
import { ReturnUser } from './ReturnUser';
import { ReturnPost } from './ReturnPost';
import * as EmailValidator from 'email-validator';
import jwt from 'jsonwebtoken';

let app = express();
let server = http.createServer(app);
let userArr: any[] = [];
let postArr: any[] = [];
let categoryArr: any[] = [];
let key = 'SuperSecret123';
let postId: number = 1;
let categoryId: number = 1;
let commentId: number = 1;


app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/Users', (req, res, next) => {
    let isAuth = verifyToken(req.headers.authorization);
    if (isAuth) {
        res.status(200).json(returnedUsersArr(userArr));
    } else if (!isAuth) {
        res.status(401).json({ message: "Unauthorized - Access token is missing or invalid", status: 401 });
    }
});

app.post('/Users', (req, res, next) => {
    let user = new User();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.userId = req.body.userId;
    user.emailAddress = req.body.emailAddress;
    user.hash(req.body.password);
    if (user.userId.length < 1) {
        res.status(406).json({ message: "Not Acceptable: Bad data in the entity IE: Post must contain a userId", status: 406 });
    } else if (!EmailValidator.validate(req.body.emailAddress)) {
        res.status(406).json({ message: "Not Acceptable: Bad data in the entity IE: Incorrectly formatted email address see error message", status: 406 });
    } else if (!getByID(user.userId)) {
        userArr.unshift(user);
        res.status(201).send(user.returnUser());
    } else {
        res.status(409).json({ message: 'Conflict, duplicate userId', status: 409 });
    }
});

app.get('/Users/:userId', (req, res, next) => {
    let temp = getByID(req.params.userId);
    let isAuth = verifyToken(req.headers.authorization);
    if (isAuth) {
        if (!temp) {
            res.status(404).json({ message: 'User not found', status: 404 });
        } else {
            res.status(200).json(temp.returnUser());
        }
    } else if (!isAuth) {
        res.status(401).json({ message: "Unauthorized - Access token is missing or invalid", status: 401 });
    }
});

app.patch('/Users/:userId', (req, res, next) => {
    let temp = getByID(req.params.userId);
    let isAuth = verifyToken(req.headers.authorization);
    if (isAuth) {
        if (!EmailValidator.validate(req.body.emailAddress)) {
            res.status(406).json({ message: "Not Acceptable: Bad data in the entity IE: Incorrectly formatted email address see error message", status: 406 });
        } else if (!temp) {
            res.status(404).json({ message: 'User not found', status: 404 });
        } else {
            let user = new User();
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.userId = req.params.userId;
            user.emailAddress = req.body.emailAddress;
            user.hash(req.body.password);
            updateUserByID(user.userId, user);
            res.status(200).json(user.returnUser());
        }
    } else if (!isAuth) {
        res.status(401).json({ message: "Unauthorized - Access token is missing or invalid", status: 401 });
    }

});

app.delete('/Users/:userId', (req, res, next) => {
    let temp = getByID(req.params.userId)
    let isAuth = verifyToken(req.headers.authorization);
    if (isAuth) {
        if (!temp) {
            res.status(404).json({ message: 'User not found', status: 404 });
        } else {
            removeByID(temp.userId);
            res.status(204).send();
        }
    } else if (!isAuth) {
        res.status(401).json({ message: "Unauthorized - Access token is missing or invalid", status: 401 });
    }
});


app.get('/Users/:userId/:password', (req, res, next) => {
    let user = getByID(req.params.userId)
    let isValidPw = "";
    if (user) {
        isValidPw = user.verifyPass(req.params.password, user.hashedPassword);
    }
    if (!user) {
        res.status(401).json({ message: 'Bad username or password', status: 401 });
    } else if (!isValidPw) {
        res.status(401).json({ message: 'Bad username or password', status: 401 });
    } else {
        res.status(200).json({ token: generateToken(user) });
    }
});

app.get('/Posts', (req, res, next) => {
    res.status(200).json(returnedPostsArr(postArr));
});

app.post('/Posts', (req, res, next) => {
    let isAuth = verifyToken(req.headers.authorization);
    if (isAuth) {
        let post = new Post();
        post.postId = postId++;
        post.title = req.body.title;
        post.content = req.body.content;
        post.headerImage = req.body.headerImage;
        post.createdDate = prettyDate();
        post.lastUpdated = prettyDate();
        post.userId = isAuth["user"]["userId"]
        if (post.title === undefined || post.content === undefined || post.title.length <= 0 || post.content.length <= 0) {
            res.status(406).json({ message: "Not Acceptable: Bad data in the entity IE: Missing Title or Content", status: 406 });
        } else {
            postArr.unshift(post);
            res.status(201).json(post.returnPost());
        }
    } else if (!isAuth) {
        res.status(401).json({ message: "Unauthorized - Access token is missing or invalid", status: 401 });
    }
});

app.get('/Posts/:postId', (req, res, next) => {
    let temp = getPostById(req.params.postId);
    if (temp) {
        res.status(200).json(temp.returnPost());
    } else {
        res.status(404).json({ message: 'Post not found', status: 404 });
    }
});

app.patch('/Posts/:postId', (req, res, next) => {
    let post = getPostById(req.params.postId);
    let isAuth = verifyToken(req.headers.authorization);
    if (isAuth) {
        if (post) {
            post.title = req.body.title;
            post.content = req.body.content;
            post.headerImage = req.body.content;
            post.lastUpdated = prettyDate();
            postArr.unshift(removePostByID(post.postId)![0]);
            res.status(200).json(post.returnPost());
        } else {
            res.status(404).json({ message: 'Post not found', status: 404 });
        }
    } else if (!isAuth) {
        res.status(401).json({ message: "Unauthorized - Access token is missing or invalid", status: 401 });
    }
});

app.delete('/Posts/:postId', (req, res, next) => {
    let post = getPostById(req.params.postId);
    let isAuth = verifyToken(req.headers.authorization);
    if (isAuth) {
        if (post) {
            removePostByID(post.postId);
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Post not found', status: 404 });
        }
    } else if (!isAuth) {
        res.status(401).json({ message: "Unauthorized - Access token is missing or invalid", status: 401 });
    }
});

app.get('/Posts/User/:userId', (req, res, next) => {
    let posts = getPostByUser(req.params.userId);
    if (posts.length >= 1) {
        res.status(200).json(returnedPostsArr(posts));
    } else {
        res.status(404).json({ message: 'Invalid user / no posts found', status: 404 });
    }
});


app.get('/Categories', (req, res, next) => {
    res.status(200).json(categoryArr);
});

app.post('/Categories', (req, res, next) => {
    let isAuth = verifyToken(req.headers.authorization);
    if (isAuth) {
        let category = new Category();
        category.categoryId = categoryId++;
        category.categoryName = req.body.categoryName;
        category.categoryDescription = req.body.categoryDescription;
        if (isDuplicateCategoryName(category.categoryName)) {
            res.status(409).json({ message: "Conflict, duplicate categoryName", status: 409 });
        } else {
            categoryArr.unshift(category);
            res.status(201).json(category);
        }
    } else if (!isAuth) {
        res.status(401).json({ message: "Unauthorized - Access token is missing or invalid", status: 401 });
    }
});

app.get('/Categories/:categoryId', (req, res, next) => {
    let category = getCategoryById(req.params.categoryId);
    if (category) {
        res.status(200).json(category);
    } else {
        res.status(404).json({ message: 'Category not Found', status: 404 });
    }

});

app.patch('/Categories/:categoryId', (req, res, next) => {
    let category = getCategoryById(req.params.categoryId);
    let isAuth = verifyToken(req.headers.authorization);
    if (isAuth) {
        if (category) {
            if (!isDuplicateCategoryName(req.body.categoryName)) {
                category.categoryName = req.body.categoryName;
                category.categoryDescription = req.body.categoryDescription;
                res.status(200).json(category);
            } else {
                res.status(409).json({ message: "Conflict, duplicate categoryName", status: 409 });
            }
        } else {
            res.status(404).json({ message: 'Category not Found', status: 404 });
        }

    } else if (!isAuth) {
        res.status(401).json({ message: "Unauthorized - Access token is missing or invalid", status: 401 });
    }
});

app.delete('/Categories/:categoryId', (req, res, next) => {
    let category = getCategoryById(req.params.categoryId);
    let isAuth = verifyToken(req.headers.authorization);
    if (isAuth) {
        if (category) {
            removeCategoryByID(category.categoryId);
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Category not Found', status: 404 });
        }
    } else if (!isAuth) {
        res.status(401).json({ message: "Unauthorized - Access token is missing or invalid", status: 401 });
    }
});

app.get('/PostCategory/:postId', (req, res, next) => {
    let post = getPostById(req.params.postId);
    if (post) {
        res.status(200).send({ postId: post.postId, categories: post.categories });
    } else {
        res.status(404).json({ message: "Post not found", status: 404 });
    }
});


app.get('/PostCategory/Posts/:categoryId', (req, res, next) => {
    let category = getCategoryById(req.params.categoryId);
    let posts = getPostsByCategory(category);
    if (category) {
        res.status(200).send({ categoryId: category.categoryId, posts: posts });
    } else {
        res.status(404).json({ message: "Category not found", status: 404 });
    }
});


app.post('/PostCategory/:postId/:categoryId', (req, res, next) => {
    let isAuth = verifyToken(req.headers.authorization);
    let post = getPostById(req.params.postId);
    let category = getCategoryById(req.params.categoryId);
    if (isAuth) {
        if (category && post) {
            post.categories.unshift(category);
            res.status(201).send("Category Assigned to Post");
        } else {
            res.status(404).json({ message: "Category or Post not found", status: 404 });
        }
    } else if (!isAuth) {
        res.status(401).json({ message: "Unauthorized - Access token is missing or invalid", status: 401 });
    }
});


app.delete('/PostCategory/:postId/:categoryId', (req, res, next) => {
    let isAuth = verifyToken(req.headers.authorization);
    let post = getPostById(req.params.postId);
    let category = getCategoryById(req.params.categoryId);
    if (isAuth) {
        if (category && post) {
            removeCategoryFromPost(post.categories, category);
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Category or Post not found", status: 404 });
        }
    } else if (!isAuth) {
        res.status(401).json({ message: "Unauthorized - Access token is missing or invalid", status: 401 });
    }
});

app.get('/Comments/:postId', (req, res, next) => {
    let post = getPostById(req.params.postId);
    if (post) {
        res.status(200).send(post.comments);
    } else {
        res.status(404).json({ message: "Post not found", status: 404 });
    }
});


app.post('/Comments/:postId', (req, res, next) => {
    let isAuth = verifyToken(req.headers.authorization);
    let post = getPostById(req.params.postId);
    let comment = new Comment();
    comment.comment = req.body.comment;
    comment.postId = req.params.postId;
    comment.userId = isAuth["user"]["userId"]
    comment.commentId = commentId++;
    comment.commentDate = prettyDate();
    if (isAuth) {
        if (post) {
            post.comments.unshift(comment);
            res.status(201).send({ comment, status: 201 });
        } else {
            res.status(404).json({ message: "Post not found", status: 404 });
        }
    } else if (!isAuth) {
        res.status(401).json({ message: "Unauthorized - Access token is missing or invalid", status: 401 });
    }
});


app.patch('/Comments/:postId/:commentId', (req, res, next) => {
    let isAuth = verifyToken(req.headers.authorization);
    let post = getPostById(req.params.postId);
    if (isAuth) {
        if (post) {
            let comment = getCommentFromPost(req.params.commentId, post.comments);
            if (comment) {
                comment.comment = req.body.comment;
                comment.commentDate = prettyDate();
                post.comments.unshift(removeCommentFromPost(req.params.commentId, post.comments)![0]);
                res.status(201).send(comment);
            } else {
                res.status(404).json({ message: "Comment or Post not found", status: 404 });
            }
        } else {
            res.status(404).json({ message: "Comment or Post not found", status: 404 });
        }
    } else if (!isAuth) {
        res.status(401).json({ message: "Unauthorized - Access token is missing or invalid", status: 401 });
    }
});


app.delete('/Comments/:postId/:commentId', (req, res, next) => {
    let isAuth = verifyToken(req.headers.authorization);
    let post = getPostById(req.params.postId);
    if (isAuth) {
        if (post) {
            let comment = getCommentFromPost(req.params.commentId, post.comments);
            if (comment) {
                removeCommentFromPost(req.params.commentId, post.comments)
                res.status(204).send();
            } else {
                res.status(404).json({ message: "Comment or Post not found", status: 404 });
            }
        } else {
            res.status(404).json({ message: "Comment or Post not found", status: 404 });
        }
    } else if (!isAuth) {
        res.status(401).json({ message: "Unauthorized - Access token is missing or invalid", status: 401 });
    }
});

server.listen(3000);

function getByID(id: string) {
    for (let i = 0; i < userArr.length; i++) {
        if (userArr[i].userId === id) {
            return userArr[i];
        }
    }
}

function removeByID(id: string) {
    for (let i = 0; i < userArr.length; i++) {
        if (userArr[i].userId === id) {
            userArr.splice(i, 1);
        }
    }
}

function updateUserByID(id: string, user: User) {
    for (let i = 0; i < userArr.length; i++) {
        if (userArr[i].userId === id) {
            userArr[i] = user;
        }
    }
}

function returnedUsersArr(arr: Array<User>) {
    let userArr: Array<ReturnUser> = [];
    for (let i = 0; i < arr.length; i++) {
        userArr.push(arr[i].returnUser());
    }
    return userArr;
}

function generateToken(user: User) {
    let token = jwt.sign({ user }, key, {
        algorithm: "HS256",
        expiresIn: 900,
    });
    return token;
}

function verifyToken(token: any) {
    if (token) {
        token = token.split(" ")[1];
    }
    let payload;
    try {
        payload = jwt.verify(token, key) as any;
    } catch (e) {
        return false;
    }
    return payload;
}

function getPostById(postId: string) {
    for (let i = 0; i < postArr.length; i++) {
        if (postArr[i].postId == postId) {
            return postArr[i];
        }
    }
    return false;
}

function removePostByID(id: string) {
    let temp;
    for (let i = 0; i < postArr.length; i++) {
        if (postArr[i].postId == id) {
            temp = postArr.splice(i, 1);
            i--;
        }
    }
    return temp;
}

function getPostByUser(userId: string) {
    let posts: Post[] = [];
    for (let i = 0; i < postArr.length; i++) {
        if (postArr[i].userId == userId) {
            posts.unshift(postArr[i]);
        }
    }
    return posts;
}


function getCategoryById(catId: string) {
    for (let i = 0; i < categoryArr.length; i++) {
        if (categoryArr[i].categoryId == catId) {
            return categoryArr[i];
        }
    }
    return false;
}

function isDuplicateCategoryName(catName: string) {
    for (let i = 0; i < categoryArr.length; i++) {
        if (categoryArr[i].categoryName == catName) {
            return true;
        }
    }
    return false;
}

function removeCategoryByID(id: string) {
    for (let i = 0; i < categoryArr.length; i++) {
        if (categoryArr[i].categoryId == id) {
            categoryArr.splice(i, 1);
            i--;
        }
    }
}

function returnedPostsArr(arr: Array<Post>) {
    let postArr: Array<ReturnPost> = [];
    for (let i = 0; i < arr.length; i++) {
        postArr.push(arr[i].returnPost());
    }
    return postArr;
}

function getPostsByCategory(category: Category) {
    //... yikes ... really great code below ...
    let posts: Post[] = []
    for (let i = 0; i < postArr.length; i++) {
        for (let j = 0; j < postArr[i].categories.length; j++) {
            if (category.categoryId == postArr[i].categories[j].categoryId) {
                posts.unshift(postArr[i]);
            }
        }
    }
    return returnedPostsArr(posts);
};

function removeCategoryFromPost(categories: Category[], category: Category) {
    for (let i = 0; i < categories.length; i++) {
        if (categories[i].categoryId == category.categoryId) {
            categories.splice(i, 1);
            i--;
        }
    }
}

function getCommentFromPost(id: string, comments: Comment[]) {
    for (let i = 0; i < comments.length; i++) {
        if (comments[i].commentId.toString() == id) {
            return comments[i];
        }
    }
}

function removeCommentFromPost(id: string, comments: Comment[]) {
    let temp;
    for (let i = 0; i < comments.length; i++) {
        if (comments[i].commentId.toString() == id) {
            temp = comments.splice(i, 1);
            i--;
        }
    }
    return temp;
}

function prettyDate() {
    //Anthony gave me this nice lookin date function
    let date = new Date();
    let month = date.getMonth() + 1
    return date.getFullYear() + "-" + month + "-" + date.getDate();
}

