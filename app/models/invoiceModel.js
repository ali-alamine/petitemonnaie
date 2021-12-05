'use strict';

var sql = require('./db.js');
var supplierModel = require('../models/supplierModel');

var Invoice = function (invoice) {
    this.store_id = invoice.store_id;
    this.supplier_id = invoice.supplier_id;
    this.check_id = invoice.check_id;
    this.is_paid = invoice.is_paid;
    this.invoice_amount = invoice.invoice_amount;
    this.invoice_date = invoice.invoice_date;
}

Invoice.addNewInvoice = function (invoice_data, result) {

    sql.beginTransaction(function (err) {
        if (err) { throw err; }
        sql.query('SELECT invoice_number from invoice where invoice_number = ' + invoice_data.invoice_number, function (err, res) {
            if (err) {
                sql.rollback(function () {
                    throw err;
                });
            } else {
                if (res.length == 0) {
                    sql.query('INSERT INTO invoice SET ?', invoice_data, function (err, res) {
                        if (err) {
                            sql.rollback(function () {
                                throw err;
                            });
                        } else {
                            let sign = invoice_data.is_paid ? '-' : '+';
                            sql.query('UPDATE supplier SET supplier_amount = supplier_amount +' + invoice_data.invoice_amount + ' WHERE supplier_id = ' + invoice_data.supplier_id, function (err, res) {
                                if (err) {
                                    sql.rollback(function () {
                                        throw err;
                                    });
                                } else {
                                    sql.commit(function (err) {
                                        if (err) {
                                            sql.rollback(function () {
                                                throw err;
                                            });
                                        } else {
                                            result(null, res);
                                        }
                                    });
                                }
                            })
                        }

                    });
                } else {
                    result('DUPLICATE_INV_NUM', res);
                }
            }
        });

    });
}

Invoice.getInvoices = function (result) {
    sql.query('SELECT inv.*,sup.*,st.*, ck.check_number FROM invoice as inv left join supplier as sup on inv.supplier_id = sup.supplier_id left join store as st on inv.store_id = st.store_id left join bank_check as ck on inv.check_id = ck.bank_check_id ORDER BY inv.invoice_order DESC , inv.invoice_id DESC limit 50', function (err, res) {
        if (err) {
            result(err);
        } else {
            result(res);
        }
    });
}

Invoice.updateInvoice = function (invoice_data, result) {
    sql.beginTransaction(function (err) {
        if (err) { throw err; }
        var sqlQuery = 'UPDATE invoice SET invoice_number = ' + "'" + invoice_data.edit_invoice_number + "'" + ',store_id = ' + "'" + invoice_data.store_id + "'" + ',supplier_id = ' + "'" + invoice_data.supplier_id + "'" + ',invoice_date = ' + "'" + invoice_data.edit_invoice_date + "'" + ',invoice_amount= ' + "'" + invoice_data.edit_invoice_amount + "'" + " WHERE invoice_id = " + "'" + invoice_data.invoice_id + "'";
        sql.query(sqlQuery, function (err, res) {
            if (err) {
                sql.rollback(function () {
                    throw err;
                });
            } else {
                if (!invoice_data.is_same_amount) {
                    var update_supplier_amount = { 'new_supplier_amount': invoice_data.new_supplier_amount, 'supplier_id': invoice_data.supplier_id }
                    supplierModel.updateAmount(update_supplier_amount, function (err, response) {
                        if (err) {
                            sql.rollback(function () {
                                throw err;
                            });
                        } else {
                            sql.commit(function (err) {
                                if (err) {
                                    sql.rollback(function () {
                                        throw err;
                                    });
                                }
                                result(null, res);
                            });
                        }
                    })
                } else {
                    sql.commit(function (err) {
                        if (err) {
                            sql.rollback(function () {
                                throw err;
                            });
                        }
                        result(null, res);
                    });
                }
            }
        });
    })
}

Invoice.deleteInvoice = function (invoice_data, result) {
    sql.beginTransaction(function (err) {
        if (err) { throw err; }
        var sqlQuery = "DELETE FROM invoice WHERE invoice_id = " + invoice_data.invoice_id;
        sql.query(sqlQuery, function (err, res) {
            if (err) {
                sql.rollback(function () {
                    throw err;
                });
            } else {
                var new_supplier_amount = parseInt(invoice_data.supplier_amount) - parseInt(invoice_data.invoice_amount);
                var update_supplier_amount = { 'new_supplier_amount': new_supplier_amount, 'supplier_id': invoice_data.supplier_id };
                supplierModel.updateAmount(update_supplier_amount, function (err, response) {
                    if (err) {
                        sql.rollback(function () {
                            throw err;
                        });
                    } else {
                        sql.commit(function (err) {
                            if (err) {
                                sql.rollback(function () {
                                    throw err;
                                });
                            }
                            result(null, res);
                        });
                    }
                })
            }
        });
    })
}

Invoice.payInvoice = function (invoice_data, result) {
    sql.beginTransaction(function (err) {
        if (err) { throw err; }
        var sqlQuery = "UPDATE INVOICE SET is_paid = 1 WHERE invoice_id = " + invoice_data.invoice_id;

        sql.query(sqlQuery, function (err, res) {
            if (err) {
                sql.rollback(function () {
                    throw err;
                });
            } else {
                let new_supplier_amount = parseInt(invoice_data.supplier_amount) - parseInt(invoice_data.invoice_amount);
                let update_supplier_amount = { 'new_supplier_amount': new_supplier_amount, 'supplier_id': invoice_data.supplier_id };
                supplierModel.updateAmount(update_supplier_amount, function (err, response) {
                    if (err) {
                        sql.rollback(function () {
                            throw err;
                        });
                    } else {
                        let invoice_amount = parseInt(invoice_data.invoice_amount);
                        let update_remain_amount_query = 'UPDATE store_entry SET remain_amount = (remain_amount - ' + invoice_amount + '), starting_amount = (starting_amount - ' + invoice_amount + ') WHERE store_id = ' +invoice_data.store_id+ ' ORDER BY store_entry_id DESC LIMIT 1';
                        sql.query(update_remain_amount_query, function (err, res) {
                            if (err) {
                                sql.rollback(function () {
                                    throw err;
                                });
                            } else {
                                sql.commit(function (err) {
                                    if (err) {
                                        sql.rollback(function () {
                                            throw err;
                                        });
                                    }
                                    result(null, res);
                                });
                            }
                        });
                    }
                })
            }
        });
    })
}

Invoice.pinInvoice = function (invoice_data, result) {
    var invoice_id = invoice_data.invoice_id;
    sql.query('UPDATE invoice SET invoice_order = 1 WHERE invoice_id= +' + invoice_id, function (err, res) {
        if (err) {
            result(err);
        } else {
            result(res);
        }
    });
}

Invoice.unPinInvoice = function (invoice_data, result) {
    var invoice_id = invoice_data.invoice_id;
    sql.query('UPDATE invoice SET invoice_order = 0 WHERE invoice_id= +' + invoice_id, function (err, res) {
        if (err) {
            result(err);
        } else {
            result(res);
        }
    });
}

Invoice.getInvoiceByNumber = function (invoice_data, result) {
    let invoice_number = invoice_data.invoice_number;
    let supplier_id = invoice_data?.supplier_id;
    let sqlQuery = '';
    if (invoice_number == '') {
        sqlQuery = 'SELECT invoice_id,invoice_number,invoice_amount from invoice where invoice_number like "% %"';
    } else {
        let supplier_id_condition = "";
        if (supplier_id != null) {

            supplier_id_condition = "supplier_id = " + supplier_id + " AND ";
        } else {
            supplier_id_condition = "";
        }
        sqlQuery = 'SELECT invoice_id,invoice_number,invoice_amount from invoice where ' + supplier_id_condition + 'invoice_number like "%' + invoice_number + '%" and check_id IS NULL LIMIT 10';
    }
    sql.query(sqlQuery, function (err, res) {
        if (err) {
            result(err);
        } else {
            result(res);
        }
    });
}

Invoice.updateInvoiceCheckID = function (data, result) {
    var sqlQuery = 'UPDATE invoice SET check_id =' + data.check_id + ' WHERE invoice_id IN (' + data.invoice_ids + ')';
    sql.query(sqlQuery, function (err, res) {
        if (err) {
            sql.rollback(function () {
                throw err;
            });
        } else {
            result(null, res);
        }
    });
}

Invoice.toggleInvoicePayment = function (is_paid, invoice_ids, result) {
    var sqlQuery = 'UPDATE invoice SET is_paid = ' + is_paid + ' WHERE invoice_id IN (' + invoice_ids + ')';
    sql.query(sqlQuery, function (err, res) {
        if (err) {
            sql.rollback(function () {
                throw err;
            });
        } else {
            result(null, res);
        }
    });
}

Invoice.searchInvoice = function (data, result) {

    if (data.invoice_number != '') {
        var sqlQuery = 'SELECT inv.*,sup.*,st.* FROM invoice as inv left join supplier as sup on inv.supplier_id = sup.supplier_id left join store as st on inv.store_id = st.store_id where invoice_number like' + "'%" + data.invoice_number + "%'" + ' ORDER BY inv.invoice_order DESC , inv.invoice_id DESC limit 50';
        sql.query(sqlQuery, function (err, res) {
            if (err) {
                sql.rollback(function () {
                    throw err;
                });
            } else {
                result(null, res);
            }
        });
    } else {
        result(null, []);
    }
}
Invoice.advancedSearchInvoice = function (data, result) {
    var order_by_date = data.order_by_date;
    var order_by_amount = data.order_by_amount;
    var amount_from = data.amount_from;
    var amount_to = data.amount_to;
    var sqlQuery = '';
    var sql_and = '';
    var sql_order = '';
    sqlQuery = 'SELECT inv.*, sup.*, st.* from invoice as inv LEFT join supplier as sup on inv.supplier_id = sup.supplier_id LEFT JOIN store as st on inv.store_id = st.store_id WHERE 1';

    if (data.supplier_ids.length > 0) {
        sql_and = sql_and + ' AND inv.supplier_id in (' + data.supplier_ids + ')';
    }
    if (data.store_ids.length > 0) {
        sql_and = sql_and + ' AND inv.store_id in (' + data.store_ids + ')';
    }
    if (data.date_from != 'Invalid date') {
        sql_and = sql_and + ' AND date(inv.invoice_date) >= ' + "'" + data.date_from + "'";
    }
    if (data.date_to != 'Invalid date') {
        sql_and = sql_and + ' AND date(inv.invoice_date) <= ' + "'" + data.date_to + "'";
    }
    if (amount_from != '') {
        sql_and = sql_and + ' AND inv.invoice_amount >= ' + amount_from;
    }
    if (amount_to != '') {
        sql_and = sql_and + ' AND inv.invoice_amount <= ' + amount_to;
    }
    if (data.is_paid == 'paid') {
        sql_and = sql_and + ' AND inv.check_id is NOT NULL';
    }
    else if (data.is_paid == 'unpaid') {
        sql_and = sql_and + ' AND inv.check_id is NULL';
    }
    if (order_by_date) {
        sql_order = sql_order + ' ORDER BY inv.invoice_order DESC , date(inv.invoice_date) DESC'
    }
    if (order_by_date && order_by_amount) {
        sql_order = sql_order + ' ,inv.invoice_amount DESC'
    }
    if (!order_by_date && order_by_amount) {
        sql_order = sql_order + ' ORDER BY inv.invoice_order DESC , inv.invoice_amount DESC'
    }
    if (!order_by_date && !order_by_amount) {
        sql_order = sql_order + ' ORDER BY inv.invoice_order DESC , inv.invoice_id DESC'
    }
    sqlQuery = sqlQuery + sql_and + sql_order;
    sql.query(sqlQuery, function (err, res) {
        if (err) {
            result(err);
        } else {
            if (res.length == 0) {
                res = 'EMPTY_RESULT';
            }
            result(res);
        }
    });
}
module.exports = Invoice;