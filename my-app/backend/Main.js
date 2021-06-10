const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql');
const expressSession = require('express-session');
const MySQLStore = require('express-mysql-session')(expressSession);
const Router = require('./Router');

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());

const daba = mysql.createConnection({
    host: 'localHost',
    user: 'root',
    password: 'ILoveChino123$',
    database: 'myapp'
});

daba.connect(function(error){
    if(error){
        console.log("Database error")
        throw error;
        return false;
    }
})

const sessionStore = new MySQLStore({
    expiration: (1000000),
    endConnectionOnClose: false
}, daba);

app.use(expressSession({
    key: 'ky',
    secret: 'st',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: (1000000),
        httpOnly: false
    }
}));

new Router(app, daba);

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.listen(3000);
