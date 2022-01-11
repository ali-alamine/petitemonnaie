'use strict';

var Invoice = require('../models/invoiceModel.js');

exports.add_new_invoice = function (req, res) {
    var request = req.body;
    var invoice_data = { "is_paid": request.is_invoice_cash_paid, "invoice_amount": request.invoice_amount, "invoice_number": request.invoice_number, 'supplier_id': request.supplier_id, 'store_id': request.store_id, 'invoice_date': request.invoice_date };
    Invoice.addNewInvoice(invoice_data, function (err, invoice) {
        if (err) {
            res.send(err);
        } else {
            res.send(invoice);
        }
    })
}

exports.pay_invoice = function (req, res) {
    var request = req.body;
    var invoice_data = { "payments": request.payments, "drawer_amount": request.drawer_amount, "store_id": request.store_id, "amount_paid": request.amount_paid, "check_id": request.check_id, "supplier_amount": request.supplier_amount, "invoice_amount": request.invoice_amount, "invoice_id": request.invoice_id, "supplier_id": request.supplier_id, "invoice_date": request.invoice_date };
    if (request.check_id != null) {

        res.send('INVOICE_IS_ASSIGNED_TO_A_CHECK');
    } else {
        Invoice.payInvoice(invoice_data, function (err, invoice) {
            if (err) {
                res.send(err)
            } else {
                res.send(invoice)
            }
        })
    }
}
exports.pay_partial_invoice_amount = function (req, res) {
    var request = req.body;
    var invoice_data = { "invoice_amount": request.invoice_amount, "drawer_amount": request.drawer_amount, "invoice_date": request.invoice_date, "store_id": request.store_id, "amount_paid": request.amount_paid, "supplier_amount": request.supplier_amount, "amount_to_pay": request.amount_to_pay, "invoice_id": request.invoice_id, "supplier_id": request.supplier_id };

    Invoice.payPartialInvoiceAmount(invoice_data, function (err, invoice) {
        if (err) {
            res.send(err)
        } else {
            res.send(invoice)
        }
    })
}

exports.get_available_invoice_to_pay = function (req, res) {
    var request = req.body;
    console.log(request)
    var supplier_data = { "supplier_id": request.supplier_id, "amount_to_pay": request.amount_to_pay };
    Invoice.getAvailableInvoiceToPay(supplier_data, function (err, invoice) {
        if (err) {
            res.send(err)
        } else {
            res.send(invoice)
        }
    })
}
exports.get_unpaid_invoices = function (req, res) {
    let request = req.body;
    let data = { "supplier_id": request.supplier_id, "amount_to_pay": request.amount_to_pay, "store_id":request.store_id };
    Invoice.getUnpaidInvoices(data, function (err, invoice) {
        if (err) {
            res.send(err)
        } else {
            res.send(invoice)
        }
    })
}
exports.pay_selected_sup_invoices = function (req, res) {
    let request = req.body;
    let invoice_data = { "invoice_ids": request.invoice_ids, "supplier_amount": request.supplier_amount, "total_invoices_amount": request.total_invoices_amount, "supplier_id": request.supplier_id, "store_id": request.store_id, "drawer_amount": request.drawer_amount };
    Invoice.payMultipleInvoices(invoice_data, function (err, invoice) {
        if (err) {
            res.send(err)
        } else {
            res.send(invoice)
        }
    })
}

exports.delete_invoice = function (req, res) {
    var request = req.body;
    var invoice_data = { "check_id": request.check_id, "supplier_amount": request.supplier_amount, "invoice_amount": request.invoice_amount, "invoice_id": request.invoice_id, "supplier_id": request.supplier_id };
    if (request.check_id != null) {

        res.send('INVOICE_IS_ASSIGNED_TO_A_CHECK');
    } else {
        Invoice.deleteInvoice(invoice_data, function (err, invoice) {
            if (err) {
                res.send(err)
            } else {
                res.send(invoice)
            }
        })
    }
}
exports.get_invoices = function (req, res) {
    Invoice.getInvoices(function (err, invoices) {
        if (err) {
            res.send(err);
        } else {
            res.send(invoices);
        }
    })
}
exports.update_invoice = function (req, res) {
    var request = req.body;
    var new_supplier_amount = 0;
    var supplier_amount = request.supplier_amount;
    var old_amount = request.edit_old_invoice_amount;
    var new_amount = request.edit_invoice_amount;
    new_supplier_amount = (parseInt(supplier_amount) - parseInt(old_amount)) + parseInt(new_amount);
    var is_same_amount = false;
    if (new_amount == old_amount) {
        is_same_amount = true;
    }
    var invoice_data = { "is_same_amount": is_same_amount, "new_supplier_amount": new_supplier_amount, "edit_invoice_amount": request.edit_invoice_amount, "invoice_id": request.invoice_id, "edit_invoice_number": request.edit_invoice_number, 'supplier_id': request.supplier_id, 'store_id': request.store_id, 'edit_invoice_date': request.edit_invoice_date };
    Invoice.updateInvoice(invoice_data, function (err, invoice) {
        if (err) {
            res.send(err);
        } else {
            res.send(invoice);
        }
    })
}
exports.pin_invoice = function (req, res) {
    Invoice.pinInvoice(req.body, function (err, store) {
        if (err) {
            res.send(err);
        } else {
            res.send(store)
        }
    });
}
exports.un_pin_invoice = function (req, res) {
    Invoice.unPinInvoice(req.body, function (err, store) {
        if (err) {
            res.send(err);
        } else {
            res.send(store)
        }
    });
}
exports.get_invoice_by_number = function (req, res) {
    Invoice.getInvoiceByNumber(req.body, function (err, store) {
        if (err) {
            res.send(err);
        } else {
            res.send(store)
        }
    });
}

exports.advanced_search_invoice = function (req, res) {
    Invoice.advancedSearchInvoice(req.body, function (err, invoice_report) {
        if (err) {
            res.send(err);
        } else {
            res.send(invoice_report)
        }
    });
}

exports.search_invoice = function (req, res) {
    Invoice.searchInvoice(req.body, function (err, invoice_report) {
        if (err) {
            res.send(err);
        } else {
            res.send(invoice_report)
        }
    });
}