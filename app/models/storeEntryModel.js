'use strict';

var sql = require('./db.js');
var CashDetailModel = require('./cashDetailModel.js');
// store constructor
var storeModel = require('../models/storeModel');
var StoreEntry =function(storeEntry){
    this.store_id=storeEntry.store_id;
    this.cash_expense_amount=storeEntry.cash_expense_amount;
    this.cash_supply_amount=storeEntry.cash_supply_amount;
    this.sales_amount=storeEntry.sales_amount;
    this.remain_amount=storeEntry.remain_amount;
    this.starting_amount=storeEntry.starting_amount;
    this.bank_deposit=storeEntry.bank_deposit;
    this.entry_report_date=storeEntry.entry_report_date;
}

StoreEntry.addNewStoreEntry = function (supply_details,expense_details,entry_details,new_store_amount,result){
    sql.beginTransaction(function(err){
        if (err) { throw err; }
        sql.query('INSERT INTO store_entry SET ?',entry_details, function(err,res){
            if(err){
                sql.rollback(function() {
                    throw err;
                  });
            }else{
                var store_entry_id=res.insertId;
                for(var i=0;i<3;i++){
                    if(i==0){

                        for(var j=0;j<supply_details.length;j++){
                            var cash_details={'text':supply_details[j].text,'store_id':entry_details.store_id,'amount':supply_details[j].amount,'type':'sup','store_entry_id':store_entry_id};
                            CashDetailModel.addCashDetails(cash_details,function(err,cashDetails){
                                if(err){
                                    sql.rollback(function() {
                                        throw err;
                                    });
                                }
                            })
                        }

                    }else if(i==1){
                        for(var j=0;j<expense_details.length;j++){
                            var cash_details={'text':expense_details[j].text,'store_id':entry_details.store_id,'amount':expense_details[j].amount,'type':'exp','store_entry_id':store_entry_id};
                            CashDetailModel.addCashDetails(cash_details,function(err,cashDetails){
                                if(err){
                                    sql.rollback(function() {
                                        throw err;
                                    });
                                }
                            })
                        }
                    }
                }
                var update_store_amount = {'new_store_amount':new_store_amount,'store_id':entry_details.store_id};
                storeModel.updateAmount(update_store_amount,function(err,response){
                    if(err){
                        sql.rollback(function(){
                            throw err;
                        })
                    }else{
                        sql.commit(function(err) {
                            if (err) { 
                                sql.rollback(function() {
                                    throw err;
                                });
                            }
                            result(null,res);
                        });
                    }
                })
            }
        })
    })
}


StoreEntry.getStoreStartingAmount = function(req,result){
    var request=req.body;
    var sqlQuery='SELECT store_entry_id, date(entry_report_date) as date, starting_amount FROM `store_entry` WHERE store_id = '+  request.store_id + ' order by store_entry_id desc LIMIT 1';

    sql.query(sqlQuery,function(err,res){
        if(err){
            result(err,null);
        }else{
            result(null,res);
        }
    })
}

module.exports = StoreEntry;