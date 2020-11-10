"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var body_parser_1 = __importDefault(require("body-parser"));
var User_1 = require("./User");
var app = express_1.default();
var server = http_1.default.createServer(app);
var userArr = [];
/*

TODO: all the todos in routes

make all errors return as json object message, status
it appears unathorized do not get a json response

fix potiential types on classes, strings vs number, date, passwords as hashed...

*/
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.get('/', function (req, res, next) {
    res.sendFile(__dirname + '/index.html');
});
app.get('/Users', function (req, res, next) {
    if (userArr.length < 1) {
        res.status(200).send("The user list is empty.");
    }
    else if (userArr.length >= 1) {
        // && if authenticated
        //do not send back a password
        res.status(200).json(userArr);
    }
    //TODO 
    //  else {
    //      res.status(401).send('Unauthorized - Access token is missing or invalid');
    //  }
});
app.post('/Users', function (req, res, next) {
    var user = new User_1.User();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.userId = req.body.userId;
    user.emailAddress = req.body.emailAddress;
    user.password = req.body.password;
    if (user.userId.length < 1) {
        res.status(406).send('Post most contain a UserID');
    }
    else if (!getByID(user.userId)) {
        userArr.push(user);
        res.status(201).send(user);
    }
    else {
        res.status(409).send('Conflict, duplicate userId');
    }
    //TODO 
    //  else {
    //      res.status(406).send('Not Acceptable: Bad data in the entity IE: Incorrectly formatted email address see error message');
    //  }
});
app.get('/Users/:userId', function (req, res, next) {
    var temp = getByID(req.params.userId);
    console.log(temp);
    if (!temp) {
        res.status(404).send('User not found');
    }
    else {
        res.status(200).json(temp);
        //ensure password is not returned
    }
    //TODO 
    //  else {
    //      res.status(401).send('Unauthorized - Access token is missing or invalid');
    //  }
});
app.patch('/Users/:userId', function (req, res, next) {
    var temp = getByID(req.params.userId);
    if (!temp) {
        res.status(404).send('User not found');
    }
    else {
        var user = new User_1.User();
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.userId = req.params.userId;
        user.emailAddress = req.body.emailAddress;
        user.password = req.body.password;
        updateUserByID(user.userId, user);
        //TODO do not send back a password
        res.status(200).json(user);
    }
    //TODO 
    //  else {
    //      res.status(401).send('Unauthorized - Access token is missing or invalid');
    //  }
    //TODO 
    //  else {
    //      res.status(406).send('Not Acceptable: Bad data in the entity IE: Incorrectly formatted email address see error messag');
    //  }
});
app.delete('/Users/:userId', function (req, res, next) {
    var temp = getByID(req.params.userId);
    if (!temp) {
        res.status(404).send('User not found');
    }
    else {
        removeByID(temp.userId);
        res.status(204).send('Deleted');
    }
    //TODO 
    //  else {
    //      res.status(401).send('Unauthorized - Access token is missing or invalid');
    //  }
});
app.get('/Users/:userId/:password', function (req, res, next) {
    res.status(404).send('not yet implemented');
    //TODO 
    //      returns a token
    //      res.status(200).send('User authenticated');
    // 
    //TODO 
    //  else {
    //      res.status(401).send('Bad username or password');
    //  }
});
app.get('/Posts', function (req, res, next) {
    res.status(404).send('not yet implemented');
    //returns all posts
    //TODO 
    // Array of available posts sorted chronologically with most recent post first
    // status 200    
    //  
    // [
    //     {
    //       "postId": 0,
    //       "createdDate": "2020-11-10",
    //       "title": "string",
    //       "content": "string",
    //       "userId": "string",
    //       "headerImage": "string",
    //       "lastUpdated": "2020-11-10"
    //     }
    //   ]
});
app.post('/Posts', function (req, res, next) {
    res.status(404).send('not yet implemented');
    // TODO 
    // 201 Post Created
    // returns
    // {
    //     "postId": 0,
    //     "createdDate": "2020-11-10",
    //     "title": "string",
    //     "content": "string",
    //     "userId": "string",
    //     "headerImage": "string",
    //     "lastUpdated": "2020-11-10"
    // }
    //TODO 
    //  else {
    //      res.status(401).send('Unauthorized - Access token is missing or invalid');
    //  }
    //TODO 
    //  else {
    //      res.status(406).send('Not Acceptable: Bad data in the entity IE: Incorrectly formatted email address see error messag');
    //  }
});
app.get('/Posts/:postId', function (req, res, next) {
    res.status(404).send('not yet implemented');
    //TODO
    // status 200 
    // gets a post by id 
    // {
    //     "postId": 0,
    //     "createdDate": "2020-11-10",
    //     "title": "string",
    //     "content": "string",
    //     "userId": "string",
    //     "headerImage": "string",
    //     "lastUpdated": "2020-11-10"
    // }
    //TODO 
    //  else {
    //      res.status(404).send('Post not Found');
    //  }
});
app.patch('/Posts/:postId', function (req, res, next) {
    res.status(404).send('not yet implemented');
    //TODO
    //status 200 Post Updated
    //TODO 
    //  else {
    //      res.status(404).send('Post not Found');
    //  }
    //TODO 
    //  else {
    //      res.status(401).send('Unauthorized - Access token is missing or invalid');
    //  }
});
app.delete('/Posts/:postId', function (req, res, next) {
    res.status(404).send('not yet implemented');
    //TODO
    //status 204 Post Deleted
    //TODO 
    //  else {
    //      res.status(404).send('Post not Found');
    //  }
    //TODO 
    //  else {
    //      res.status(401).send('Unauthorized - Access token is missing or invalid');
    //  }
});
app.get('/Posts/User/:userId', function (req, res, next) {
    res.status(404).send('not yet implemented');
    //TODO
    //status 200 	
    //Array of available posts sorted chronologically with most recent post first for the given user
    // [
    //     {
    //       "postId": 0,
    //       "createdDate": "2020-11-10",
    //       "title": "string",
    //       "content": "string",
    //       "userId": "string",
    //       "headerImage": "string",
    //       "lastUpdated": "2020-11-10"
    //     }
    // ]
    //TODO 
    //  else {
    //      res.status(404).send('Invalid user / no posts found');
    //  }
});
app.get('/Categories', function (req, res, next) {
    res.status(404).send('not yet implemented');
    //TODO
    //200 
    //Array of available categories sorted alphabethically
    // [
    //     {
    //       "categoryId": 0,
    //       "categoryName": "string",
    //       "categoryDescription": "string"
    //     }
    // ]
});
app.post('/Categories', function (req, res, next) {
    res.status(404).send('not yet implemented');
    //TODO
    //status 201 Category Created
    // {
    //     "categoryId": 0,
    //     "categoryName": "string",
    //     "categoryDescription": "string"
    // }
    //TODO 
    //  else {
    //      res.status(409).send('Conflict, duplicate categoryName');
    //  }
    //TODO 
    //  else {
    //      res.status(401).send('Unauthorized - Access token is missing or invalid');
    //  }
});
app.get('/Categories/:categoryId', function (req, res, next) {
    res.status(404).send('not yet implemented');
    //TODO
    //200 Requested Category
    // {
    //     "categoryId": 0,
    //     "categoryName": "string",
    //     "categoryDescription": "string"
    // }
    //TODO 
    //  else {
    //      res.status(404).send('Category not Found');
    //  }
});
app.patch('/Categories/:categoryId', function (req, res, next) {
    res.status(404).send('not yet implemented');
    //Updates an existing Category
    //TODO
    //201 Category Updated
    // {
    //     "categoryId": 0,
    //     "categoryName": "string",
    //     "categoryDescription": "string"
    // }
    //TODO 
    //  else {
    //      res.status(404).send('Category not Found');
    //  }
    //TODO 
    //  else {
    //      res.status(401).send('Unauthorized - Access token is missing or invalid');
    //  }
});
app.delete('/Categories/:categoryId', function (req, res, next) {
    res.status(404).send('not yet implemented');
    //TODO
    //204 Category Deleted
    //TODO 
    //  else {
    //      res.status(404).send('Category not Found');
    //  }
    //TODO 
    //  else {
    //      res.status(401).send('Unauthorized - Access token is missing or invalid');
    //  }
});
app.get('/PostCategory/:postId', function (req, res, next) {
    res.status(404).send('not yet implemented');
    //TODO
    //200 	Returns all categories related to post
    // {
    //     "postId": 0,
    //     "categories": [
    //       {
    //         "categoryId": 0,
    //         "categoryName": "string",
    //         "categoryDescription": "string"
    //       }
    //     ]
    // }
    //TODO 
    //  else {
    //      res.status(404).send('Post not Found');
    //  }
});
app.get('/PostCategory/Posts/:categoryId', function (req, res, next) {
    res.status(404).send('not yet implemented');
    //TODO 
    //200 List of posts related to the given category
    // {
    //     "categoryId": 0,
    //     "posts": [
    //       {
    //         "postId": 0,
    //         "createdDate": "2020-11-10",
    //         "title": "string",
    //         "content": "string",
    //         "userId": "string",
    //         "headerImage": "string",
    //         "lastUpdated": "2020-11-10"
    //       }
    //     ]
    // }
    //TODO 
    //  else {
    //      res.status(404).send('Category not Found');
    //  }
});
app.post('/PostCategory/:postId/:categoryId', function (req, res, next) {
    res.status(404).send('not yet implemented');
    //TODO 
    //201 Category Assigned to Post
    //TODO 
    //  else {
    //      res.status(404).send('Category or Post not Found');
    //  }
    //TODO 
    //  else {
    //      res.status(401).send('Unauthorized - Access token is missing or invalid');
    //  }
});
app.delete('/PostCategory/:postId/:categoryId', function (req, res, next) {
    res.status(404).send('not yet implemented');
    //TODO 
    //204 Category removed from Post
    //TODO 
    //  else {
    //      res.status(404).send('Category or Post not Found');
    //  }
    //TODO 
    //  else {
    //      res.status(401).send('Unauthorized - Access token is missing or invalid');
    //  }
});
app.get('/Comments/:postId', function (req, res, next) {
    res.status(404).send('not yet implemented');
    //TODO
    //200 List of all comments related to a post in chronological order with most recent comment first
    // [
    //     {
    //       "commentId": 0,
    //       "comment": "string",
    //       "userId": "string",
    //       "postId": 0,
    //       "commentDate": "2020-11-10"
    //     }
    // ]
    //TODO 
    //  else {
    //      res.status(404).send('Post not Found');
    //  }
});
app.post('/Comments/:postId', function (req, res, next) {
    res.status(404).send('not yet implemented');
    //TODO
    //201 Comment Added
    // {
    //     "commentId": 0,
    //     "comment": "string",
    //     "userId": "string",
    //     "postId": 0,
    //     "commentDate": "2020-11-10"
    // }
    //TODO 
    //  else {
    //      res.status(404).send('Post not Found');
    //  }
    //TODO 
    //  else {
    //      res.status(401).send('Unauthorized - Access token is missing or invalid');
    //  }
});
app.patch('/Comments/:postId/:commentId', function (req, res, next) {
    res.status(404).send('not yet implemented');
    //TODO 
    //Updates an existing comment
    //201 Comment Updated
    // {
    //     "commentId": 0,
    //     "comment": "string",
    //     "userId": "string",
    //     "postId": 0,
    //     "commentDate": "2020-11-10"
    // }
    //TODO 
    //  else {
    //      res.status(404).send('Comment or Post not Found');
    //  }
    //TODO 
    //  else {
    //      res.status(401).send('Unauthorized - Access token is missing or invalid');
    //  }
});
app.delete('/Comments/:postId/:commentId', function (req, res, next) {
    res.status(404).send('not yet implemented');
    //TODO 
    //204 Comment removed from Post
    //TODO 
    //  else {
    //      res.status(404).send('Comment or Post not Found');
    //  }
    //TODO 
    //  else {
    //      res.status(401).send('Unauthorized - Access token is missing or invalid');
    //  }
});
// app.use('/', (req, res, next) => {
//     res.status(400).send("Bad request");
// });
server.listen(3000);
function getByID(id) {
    for (var i = 0; i < userArr.length; i++) {
        if (userArr[i].userId === id) {
            return userArr[i];
        }
    }
}
function removeByID(id) {
    var temp = new User_1.User();
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
//# sourceMappingURL=index.js.map