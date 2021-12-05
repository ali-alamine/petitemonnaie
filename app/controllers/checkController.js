'use strict';

var Check = require('../models/checkModel.js');

exports.add_new_check=function(req,res){

    var request = req.body;

    var check_data={};
    if(request.is_for_sup==false){
        check_data={'store_id':request.store_id,'store_amount':request.store_amount,'check_number':request.check_number,'check_description':request.check_description,'check_amount':request.check_amount,'check_date':request.check_date,'is_paid':request.is_paid_check,'is_for_sup':request.is_for_sup}
    }else{
        var new_arr_val= request.invoice_ids.join(',');
        check_data={'store_id':request.store_id,'store_amount':request.store_amount,'supplier_amount':request.supplier_amount,'supplier_id':request.supplier_id,'check_number':request.check_number,'check_amount':request.check_amount,'check_date':request.check_date,'is_paid':request.is_paid_check,'invoice_ids':new_arr_val,'is_for_sup':request.is_for_sup}
    }
    Check.addNewCheck(check_data,function(err,Check){
        if(err){
            res.send(err)
        }else{
            res.send(Check)
        }
    })
}
exports.get_checks=function(req,res){
    Check.getChecks(function(err,Check){
        if(err){
            res.send(err)
        }else{
            res.send(Check)
        }
    })
}
exports.pin_check= function(req,res){
    Check.pinCheck(req.body,function(err,store){
        if(err){
            res.send(err);
        }else{
            res.send(store)
        }
    });
}
exports.un_pin_check= function(req,res){
    Check.unPinCheck(req.body,function(err,check){
        if(err){
            res.send(err);
        }else{
            res.send(check)
        }
    });
}
exports.set_check_paid= function(req,res){
    Check.setCheckPaid(req.body,function(err,check){
        if(err){
            res.send(err);
        }else{
            res.send(check)
        }
    });
}
exports.set_check_unPaid= function(req,res){
    Check.setCheckUnPaid(req.body,function(err,check){
        if(err){
            res.send(err);
        }else{
            res.send(check)
        }
    });
}
exports.update_check = function(req,res){
  Check.updateCheck(req.body,function(err,check){
      if(err){
          res.send(err);
      }else{
          res.send(check)
      }
  })  
}
exports.advanced_search_bank_check=function(req,res){
    Check.advancedSearchBankCheck(req.body,function(err,Check_report){
        if(err){
            res.send(err)
        }else{
            res.send(Check_report)
        }
    })
}
exports.delete_check=function(req,res){

    Check.deleteCheck(req.body,function(err,Check_report){
        if(err){
            res.send(err);
        }else{
            res.send(Check_report);
        }
    })
}
exports.search_check = function(req,res){
    Check.searchCheck(req.body,function(err,invoice_report){
        if(err){
            res.send(err);
        }else{
            res.send(invoice_report)
        }
    });
}
exports.get_assigned_invoices = function(req,res){
    console.log('req.body')
    console.log(req.body)
    Check.getAssignedInvoices(req.body,function(err,invoice_report){
        if(err){
            res.send(err);
        }else{
            res.send(invoice_report)
        }
    });
}