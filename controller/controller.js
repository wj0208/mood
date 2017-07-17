var formidable = require('formidable');
var md5 = require('../model/md5.js');
var operaDb = require('../model/operaDb.js');
var sillytime = require('silly-datetime');
exports.showIndex = function (req,res,next) {
    var username = req.session.login == "1" ? req.session.username : "";
    var login = req.session.login == "1" ? true : false;
    operaDb.finddb("mood", function (err, result) {
        if (result.length != 0) {
            var mood = result;
            operaDb.finddb("comment",function (err,result) {
                if(result!=0){
                    var com = result;
                    res.render('index', {
                        "username": username,
                        "login": login,
                        "active": "首页",
                        "mood": mood,
                        "com":com
                    });
                }else{
                    res.render('index', {
                        "username": username,
                        "login": login,
                        "active": "首页",
                        "mood": mood,
                        "com":null
                    });
                }
            })

        } else {
            res.render('index', {
                "username": username,
                "login": login,
                "active": "首页",
                "mood": null
            });
        }
    })
}
exports.showMyMood = function (req,res,next) {
    var username = req.session.login == "1"?req.session.username:"";
    var login = req.session.login =="1" ?true:false;
    operaDb.finddb("mood",{"username":username},function (err,result) {
        if(result.length!=0){
            res.render('myMood',{
                "username":username,
                "login":login,
                "active":"我的说说",
                "mood":result
            });
        }else{
            res.render('myMood',{
                "username":username,
                "login":login,
                "active":"我的说说",
                "mood":null
            });
        }
    })

}
exports.doPublish = function (req,res,next) {
    var form = new formidable.IncomingForm();
    var username = req.session.username;
    var nowtime = sillytime.format(new Date(),'YYYY年MM月DD日 HH:mm:ss');//评论的时间
    form.parse(req,function (err,fields) {
        var content = fields.content;
        operaDb.insertOne("mood",{"username":username,"content":content,"publishtime":nowtime},function (err,result) {
            res.send("1");
        })
    })

}
exports.doReply = function (req,res,next) {
    var form = new formidable.IncomingForm();
    var username = req.session.username;
    var nowtime = sillytime.format(new Date(),'YYYY年MM月DD日 HH:mm:ss');//评论的时间
    form.parse(req,function (err,fields) {
        var moodId = fields.moodId;
        var replycon = fields.replycon;
        operaDb.insertOne("comment",{"moodid":moodId,"username":username,"comcontent":replycon,"comtime":nowtime},function (err,result) {
            res.send("1");
        })
    })

}
exports.showRegister = function (req,res,next) {
    res.render('register',{
        "username":req.session.login == "1"?req.session.username:"",
        "login":req.session.login =="1" ?true:false,
        "active":"注册"
    });
}
exports.doRegister = function (req,res,next) {
    var form = new formidable.IncomingForm();
    form.parse(req,function (err,fields) {
        var username = fields.username;
        var password = fields.password;
        password = md5(md5(password)+"ojay");
        operaDb.finddb("user",{'username':username},function (err,result) {
            if(err){
                res.send("-3");
                return;
            }
            if(result.length !=0){
                res.send("-1");
                return;
            }else {
                req.session.login="1";
                req.session.username = username;
                operaDb.insertOne("user",{'username':username,'password':password},function (err,result) {
                    res.send("1");
                })

            }
        })
    })
}
exports.showLogin = function (req,res,next) {
    res.render('login',{
        "username":req.session.login == "1"?req.session.username:"",
        "login":req.session.login =="1" ?true:false,
        "active":"登录"
    });
}
exports.doLogin = function (req,res,next) {
    var form = new formidable.IncomingForm();
    form.parse(req,function (err,fields) {
        var username = fields.username;
        var password = fields.password;
        password = md5(md5(password)+"ojay");
        operaDb.finddb("user",{'username':username},function (err,result) {
           if(result.length == 0){
               res.send("-1");
               return;
           }
           if(password==result[0].password){
               req.session.login="1";
               req.session.username = username;
               res.send("1");
           }else{
               res.send("-2");
           }
        })
    })
}
exports.doLogout = function (req,res,next) {
    delete req.session.username;
    delete req.session.login;
    res.render('login',{
        "active":"首页"
    });
}