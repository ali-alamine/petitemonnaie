'use strict';

var Supplier = require('../models/supplierModel.js');

exports.add_new_supplier = function(req,res){

    var new_supplier = new Supplier(req.body);
    Supplier.addNewSupplier(new_supplier,function(err,supplier){
        if(err){
            res.send(err);
        }else{
            res.send(supplier)
        }
    });
}
exports.get_suppliers = function(req,res){

    Supplier.getSuppliers(function(err,supplierObj){
        if(err){
            res.send(err);
        }else{
            res.send(supplierObj)
        }
    });
}
exports.delete_supplier = function(req,res){
    Supplier.deleteSupplier(req.body,function(err,supplier){
        if(err){
            res.send(err);
        }else{
            res.send(supplier)
        }
    });
}
exports.pin_supplier = function(req,res){
    Supplier.pinSupplier(req.body,function(err,supplier){
        if(err){
            res.send(err);
        }else{
            res.send(supplier)
        }
    });
}
exports.un_pin_supplier = function(req,res){
    Supplier.unPinSupplier(req.body,function(err,supplier){
        if(err){
            res.send(err);
        }else{
            res.send(supplier)
        }
    });
}
exports.update_supplier = function(req,res){
    Supplier.updateSupplier(req.body,function(err,supplier){
        if(err){
            res.send(err);
        }else{
            res.send(supplier)
        }
    });
}
exports.search_supplier_by_name = function(req,res){
    var request= req.body;
    var supplier_name=request.supplier_name;
    Supplier.searchSupplierByName(supplier_name,function(err,supplier){
        if(err){
            res.send(err);
        }else{
            res.send(supplier)
        }
    });
}
exports.advanced_search_suppliers = function(req,res){
    Supplier.advancedSearchSuppliers(req.body,function(err,supplier){
        if(err){
            res.send(err);
        }else{
            res.send(supplier)
        }
    });
}
exports.get_supplier_account = function(req,res){
    var request=req.body;
    var supplier_id=request.supplier_id;
    Supplier.getSupplierAccount(supplier_id,function(err,supplierObj){
        if(err){
            res.send(err);
        }else{
            res.send(supplierObj)
        }
    });
}