import express from 'express'
import http from 'http'
import bodyParser from 'body-parser';
import { User } from './User';

let app = express();
let server = http.createServer(app);
let userArr: any[] = [];

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res, next) => {
    console.log("Get: /");
    res.sendFile(__dirname + '/index.html');
});

app.get('/Users', (req, res, next) => {
    console.log("Get: /Users");
    if (userArr.length < 1) {
        res.status(200).send("The user list is empty.")
    } else {
        res.status(200).json(userArr);
    }

});

app.post('/User', (req, res, next) => {
    console.log("Post: /User");
    let user = new User();
    user.FirstName = req.body.FirstName;
    user.LastName = req.body.LastName;
    user.UserID = req.body.UserID;
    user.EmailAddress = req.body.EmailAddress;
    user.Password = req.body.Password
    if (user.UserID.length < 1) {
        res.status(400).send('Post most contain a UserID')
    } else if (!getByID(user.UserID)) {
        userArr.push(user);
        res.status(201).send(user);
    } else {
        res.status(400).send('Error: Non-unique UserID')
    }

});

app.get('/User/:UserID', (req, res, next) => {
    console.log("Get: /User/:UserID");
    var temp = getByID(req.params.UserID)
    if (!temp) {
        res.status(404).send('User Not Found');
    } else {
        res.status(200).json(temp);
    }
});

app.patch('/User/:UserID', (req, res, next) => {
    console.log("Patch: /User/:UserID");
    var temp = getByID(req.params.UserID)
    if (!temp) {
        res.status(404).send('User Not Found');
    } else {
        let user = new User();
        user.FirstName = req.body.FirstName;
        user.LastName = req.body.LastName;
        user.UserID = req.params.UserID;
        user.EmailAddress = req.body.EmailAddress;
        user.Password = req.body.Password
        updateUserByID(user.UserID, user);
        res.status(200).json(user);
    }
});

app.delete('/User/:UserID', (req, res, next) => {
    console.log("Delete User");
    var temp = getByID(req.params.UserID)
    if (!temp) {
        res.status(404).send('User Not Found, cannot delete');
    } else {
        removeByID(temp.UserID);
        res.sendStatus(200);
    }

})

//undefined routes will go to help page
app.use('/', (req, res, next) => {
    res.sendFile(__dirname + '/index.html');
});

server.listen(3000);

function getByID(id: string) {
    for (let i = 0; i < userArr.length; i++) {
        if (userArr[i].UserID === id) {
            return userArr[i];
        }
    }
}

function removeByID(id: string) {
    let temp = new User();
    for (let i = 0; i < userArr.length; i++) {
        if (userArr[i].UserID === id) {
            temp = userArr[i]
            userArr.splice(i, 1);
        }
    }
}

function updateUserByID(id: string, user: User) {
    for (let i = 0; i < userArr.length; i++) {
        if (userArr[i].UserID === id) {
            userArr[i] = user;
        }
    }
}