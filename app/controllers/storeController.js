'use strict';

var Store = require('../models/storeModel.js');

exports.add_new_store = function(req,res){

    var new_store = new Store(req.body);
    Store.addNewStore(new_store,function(err,store){
        if(err){
            res.send(err);
        }else{
            res.send(store)
        }
    });
};

exports.get_all_stores = function (req,res){

    Store.getAllStores(function(err,store){
        if(err){
            res.send(err);
        }else{
            res.send(store)
        }
    });

};
exports.search_store_by_name = function(req,res){
    var request= req.body;
    var store_name=request.store_name;
    Store.searchStoreByName(store_name,function(err,store){
        if(err){
            res.send(err);
        }else{
            res.send(store)
        }
    });
};
exports.get_store_bank_acc = function (req,res){

    Store.getStoreBankAcc(req.body,function(err,store){
        if(err){
            res.send(err);
        }else{
            res.send(store);
        }
    });
};

exports.get_store_expenses = function (req,res){

    Store.getStoreExpenses(req.body,function(err,store){
        if(err){
            res.send(err);
        }else{
            res.send(store);
        }
    });

}

