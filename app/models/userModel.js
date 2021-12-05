'use strict';
var sql = require('./db.js');


var User =function(user){
    this.username=user.username;
    this.password=user.password;
    this.user_type=user.user_type;
    this.store_id=user.store_id;
}

User.addNewUser = function (new_user,result){
    sql.query('INSERT INTO `user` SET ?',new_user, function(err,res){
        if(err){
            result(err,null);
        }else{
            result(null,res.inserted);
        }
    })
}

User.getAllUsers = function (result){
    sql.query('SELECT * FROM `user`', function(err,res){
        if(err){
            result(err);
        }else{
            result(res);
        }
    })
}

User.checkLogin = function (loginData,result){
    sql.query('SELECT * from `user` where username = ' + "'" + loginData.username + "'"+ ' and password = ' + "'" +loginData.password + "'", function(err,res){
        if(err){
            result(err,null);
        }else{
            let message='';
            
            if(res.length > 0){
                message="VALID_USER";
            }else{
                message="LOGIN_FAILED";
            }
            result(message);
        }
    })
}

module.exports = User;