'use strict';
var sql = require('./db.js');

var CashDetail = function(CashDetail){
    this.text=CashDetail.text;
    this.amount=CashDetail.amount;
    this.type=CashDetail.type;
    this.store_id=CashDetail.store_id;
}
CashDetail.addCashDetails= function(cashDetails,result){
    sql.query('INSERT INTO cash_detail SET ?',cashDetails, function(err,res){
        if(err){
            sql.rollback(function() {
                throw err;
              });
        }else{
              result(null,res);
        }
    })
}

module.exports = CashDetail;