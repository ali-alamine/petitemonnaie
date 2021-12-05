'use strict';

var User = require('../models/userModel.js');

exports.add_new_user = function(req,res){

    var new_user = new User(req.body);
    User.addNewUser(new_user,function(err,user){
        if(err){
            res.send(err);
        }else{
            res.send(user)
        }
    });
}
exports.check_login = function(req,res){
    User.checkLogin(req.body,function(err,user){
        if(err){
            res.send(err);
        }else{
            res.send(user)
        }
    });
}
exports.get_all_users = function(req,res){
    User.getAllUsers(function(err,user){
        if(err){
            res.send(err);
        }else{
            res.send(user)
        }
    });
}