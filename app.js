var express = require('express');
var session = require('express-session');
var mongodb = require('mongodb');
var controller = require('./controller/controller.js');
var app = express();


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.set('view engine','ejs');


app.use(express.static('./public'))
app.get('/',controller.showLogin);
app.get('/index',controller.showIndex);
app.get('/register',controller.showRegister);
app.post('/doRegister',controller.doRegister);
app.get('/login',controller.showLogin);
app.post('/doLogin',controller.doLogin);
app.post('/doPublish',controller.doPublish);
app.post('/doReply',controller.doReply);
app.get('/logout',controller.doLogout);
app.get('/myMood',controller.showMyMood);

app.listen(3000);