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
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.get('/', function (req, res, next) {
    console.log("Get: /");
    res.sendFile(__dirname + '/index.html');
});
app.get('/Users', function (req, res, next) {
    console.log("Get: /Users");
    if (userArr.length < 1) {
        res.status(200).send("The user list is empty.");
    }
    else {
        res.status(200).json(userArr);
    }
});
app.post('/User', function (req, res, next) {
    console.log("Post: /User");
    var user = new User_1.User();
    user.FirstName = req.body.FirstName;
    user.LastName = req.body.LastName;
    user.UserID = req.body.UserID;
    user.EmailAddress = req.body.EmailAddress;
    user.Password = req.body.Password;
    if (user.UserID.length < 1) {
        res.status(400).send('Post most contain a UserID');
    }
    else if (!getByID(user.UserID)) {
        userArr.push(user);
        res.status(201).send(user);
    }
    else {
        res.status(400).send('Error: Non-unique UserID');
    }
});
app.get('/User/:UserID', function (req, res, next) {
    console.log("Get: /User/:UserID");
    var temp = getByID(req.params.UserID);
    if (!temp) {
        res.status(404).send('User Not Found');
    }
    else {
        res.status(200).json(temp);
    }
});
app.patch('/User/:UserID', function (req, res, next) {
    console.log("Patch: /User/:UserID");
    var temp = getByID(req.params.UserID);
    if (!temp) {
        res.status(404).send('User Not Found');
    }
    else {
        var user = new User_1.User();
        user.FirstName = req.body.FirstName;
        user.LastName = req.body.LastName;
        user.UserID = req.params.UserID;
        user.EmailAddress = req.body.EmailAddress;
        user.Password = req.body.Password;
        updateUserByID(user.UserID, user);
        res.status(200).json(user);
    }
});
app.delete('/User/:UserID', function (req, res, next) {
    console.log("Delete User");
    var temp = getByID(req.params.UserID);
    if (!temp) {
        res.status(404).send('User Not Found, cannot delete');
    }
    else {
        removeByID(temp.UserID);
        res.sendStatus(200);
    }
});
//undefined routes will go to help page
app.use('/', function (req, res, next) {
    res.sendFile(__dirname + '/index.html');
});
server.listen(3000);
function getByID(id) {
    for (var i = 0; i < userArr.length; i++) {
        if (userArr[i].UserID === id) {
            return userArr[i];
        }
    }
}
function removeByID(id) {
    var temp = new User_1.User();
    for (var i = 0; i < userArr.length; i++) {
        if (userArr[i].UserID === id) {
            temp = userArr[i];
            userArr.splice(i, 1);
        }
    }
}
function updateUserByID(id, user) {
    for (var i = 0; i < userArr.length; i++) {
        if (userArr[i].UserID === id) {
            userArr[i] = user;
        }
    }
}
//# sourceMappingURL=index.js.map