'use strict';

var StoreEntry=  require('../models/storeEntryModel.js');

exports.add_new_store_entry = function(req,res){
 
    var request=req.body;
    var expense_details=request.cash_expense_details;
    var supply_details=request.cash_supply_details;
    var new_store_entry = new StoreEntry(request);
    new_store_entry.starting_amount=new_store_entry.remain_amount;

    let new_store_amount=(parseInt(request.store_amount) + parseInt(request.bank_deposit));

    StoreEntry.addNewStoreEntry(supply_details,expense_details,new_store_entry,new_store_amount,function(err,storeEntry){
        if(err){
            res.send(err);
        }else{
            res.sendStatus(200);
        };
    })
};

exports.get_store_starting_amount = function(req,res){
    StoreEntry.getStoreStartingAmount(req,function(err,entry){
        if(err){
            res.send(err);
        }else{
            res.send(entry)
        };
    })
}



