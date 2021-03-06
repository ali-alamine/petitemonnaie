'use strict';

var sql = require('./db.js');
var supplierModel = require('../models/supplierModel');
var storeModel = require('../models/storeModel');

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

        sql.query('SELECT invoice_number from invoice where invoice_number = ' + invoice_data.edit_invoice_number, function (err, res) {
            if (err) {
                sql.rollback(function () {
                    throw err;
                });
            } else {
                if (res.length == 0) {
                    var sqlQuery = 'UPDATE invoice SET invoice_number = ' + "'" + invoice_data.edit_invoice_number + "'" + ',store_id = ' + "'" + invoice_data.store_id + "'" + ',supplier_id = ' + "'" + invoice_data.supplier_id + "'" + ',invoice_amount= ' + "'" + invoice_data.edit_invoice_amount + "'" + " WHERE invoice_id = " + "'" + invoice_data.invoice_id + "'";
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
                } else {
                    result('DUPLICATE_INV_NUM', res);
                }
            }
        })
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


Invoice.payMultipleInvoices = function (invoice_data, result) {
    console.log(invoice_data)
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    sql.beginTransaction(function (err) {
        if (err) { throw err; }
        var sqlQuery = "UPDATE invoice SET is_paid = 1 WHERE invoice_id in (" + invoice_data.invoice_ids + ")";
        sql.query(sqlQuery, function (err, res) {
            if (err) {
                sql.rollback(function () {
                    throw err;
                });
            } else {
                let new_supplier_amount = parseInt(invoice_data.supplier_amount) - parseInt(invoice_data.total_invoices_amount);
                let update_supplier_amount = { 'new_supplier_amount': new_supplier_amount, 'supplier_id': invoice_data.supplier_id };
                supplierModel.updateAmount(update_supplier_amount, function (err, response) {
                    if (err) {
                        sql.rollback(function () {
                            throw err;
                        });
                    } else {
                        var total_invoices_amount = parseInt(invoice_data.total_invoices_amount);
                        sql.query('SELECT store_entry_id, remain_amount from store_entry where store_id = ' + invoice_data.store_id + ' ORDER BY store_entry_id DESC LIMIT 1', function (err, res) {
                            if (err || res.length === 0) {
                                sql.rollback(function () {
                                    throw err;
                                })
                            } else {
                                let new_remain_amount = parseInt(res[0].remain_amount) - parseInt(total_invoices_amount);
                                console.log(new_remain_amount, ' sssssssssssssssssssssssssssss ')
                                let store_entry_id = parseInt(res[0].store_entry_id);

                                let update_remain_amount_query = 'UPDATE store_entry SET remain_amount = ' + new_remain_amount + ' WHERE store_entry_id = ' + store_entry_id + ' ORDER BY store_entry_id DESC LIMIT 1';

                                sql.query(update_remain_amount_query, function (err, res) {
                                    if (err) {
                                        sql.rollback(function () {
                                            throw err;
                                        });
                                    } else {

                                        let new_drawer_amount = parseInt(invoice_data.drawer_amount) - parseInt(total_invoices_amount);

                                        var update_drawer_amount = { 'new_drawer_amount': new_drawer_amount, 'store_id': invoice_data.store_id };
                                        storeModel.updateDrawerAmount(update_drawer_amount, function (err, response) {
                                            if (err) {
                                                sql.rollback(function () {
                                                    throw err;
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
                                        })
                                    }
                                });
                            }
                        })
                    }
                })
            }
        });
    })
}


Invoice.payInvoice = function (invoice_data, result) {
    sql.beginTransaction(function (err) {
        if (err) { throw err; }
        var sqlQuery = "UPDATE invoice SET is_paid = 1 WHERE invoice_id = " + invoice_data.invoice_id;
        sql.query(sqlQuery, function (err, res) {
            if (err) {
                sql.rollback(function () {
                    throw err;
                });
            } else {
                let new_supplier_amount = parseInt(invoice_data.supplier_amount) - (parseInt(invoice_data.invoice_amount) - parseInt(invoice_data.amount_paid));
                let update_supplier_amount = { 'new_supplier_amount': new_supplier_amount, 'supplier_id': invoice_data.supplier_id };
                supplierModel.updateAmount(update_supplier_amount, function (err, response) {
                    if (err) {
                        sql.rollback(function () {
                            throw err;
                        });
                    } else {
                        var payment_amount = parseInt(invoice_data.invoice_amount) - parseInt(invoice_data.amount_paid);
                        sql.query('SELECT store_entry_id, remain_amount from store_entry where store_id = ' + invoice_data.store_id + ' ORDER BY store_entry_id DESC LIMIT 1', function (err, res) {
                            if (err || res.length === 0) {
                                sql.rollback(function () {
                                    throw err;
                                })
                            } else {
                                let new_remain_amount = parseInt(res[0].remain_amount) - parseInt(payment_amount);
                                let store_entry_id = parseInt(res[0].store_entry_id);
                                let update_remain_amount_query = 'UPDATE store_entry SET remain_amount = ' + new_remain_amount + ' WHERE store_entry_id = ' + store_entry_id;

                                sql.query(update_remain_amount_query, function (err, res) {
                                    if (err) {
                                        sql.rollback(function () {
                                            throw err;
                                        });
                                    } else {
                                        let new_drawer_amount = parseInt(invoice_data.drawer_amount) - parseInt(payment_amount);

                                        var update_drawer_amount = { 'new_drawer_amount': new_drawer_amount, 'store_id': invoice_data.store_id };
                                        storeModel.updateDrawerAmount(update_drawer_amount, function (err, response) {
                                            if (err) {
                                                sql.rollback(function () {
                                                    throw err;
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
                                        })
                                    }
                                });
                            }
                        })
                    }
                })
            }
        });
    })
}






Invoice.unPayInvoice = function (invoice_data, result) {
    sql.beginTransaction(function (err) {
        if (err) { throw err; }
        var sqlQuery = "UPDATE invoice SET is_paid = 0 WHERE invoice_id = " + invoice_data.invoice_id;
        sql.query(sqlQuery, function (err, res) {
            if (err) {
                sql.rollback(function () {
                    throw err;
                });
            } else {
                let new_supplier_amount = parseInt(invoice_data.supplier_amount) + (parseInt(invoice_data.invoice_amount) - parseInt(invoice_data.amount_paid));
                let update_supplier_amount = { 'new_supplier_amount': new_supplier_amount, 'supplier_id': invoice_data.supplier_id };
                supplierModel.updateAmount(update_supplier_amount, function (err, response) {
                    if (err) {
                        sql.rollback(function () {
                            throw err;
                        });
                    } else {
                        var payment_amount = parseInt(invoice_data.invoice_amount) - parseInt(invoice_data.amount_paid);
                        sql.query('SELECT store_entry_id, remain_amount from store_entry ORDER BY store_entry_id DESC LIMIT 1', function (err, res) {
                            if (err || res.length === 0) {
                                sql.rollback(function () {
                                    throw err;
                                })
                            } else {
                                let new_remain_amount = res[0].remain_amount - parseInt(payment_amount);

                                let update_remain_amount_query = 'UPDATE store_entry SET remain_amount = ' + new_remain_amount + ' WHERE store_id = ' + invoice_data.store_id + ' ORDER BY store_entry_id DESC LIMIT 1';

                                sql.query(update_remain_amount_query, function (err, res) {
                                    if (err) {
                                        sql.rollback(function () {
                                            throw err;
                                        });
                                    } else {

                                        let new_drawer_amount = parseInt(invoice_data.drawer_amount) - parseInt(payment_amount);

                                        var update_drawer_amount = { 'new_drawer_amount': new_drawer_amount, 'store_id': invoice_data.store_id };
                                        storeModel.updateDrawerAmount(update_drawer_amount, function (err, response) {
                                            if (err) {
                                                sql.rollback(function () {
                                                    throw err;
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
                                        })
                                    }
                                });
                            }
                        })
                    }
                })
            }
        });
    })
}







Invoice.payPartialInvoiceAmount = function (invoice_data, result) {
    sql.beginTransaction(function (err) {
        if (err) { throw err; }
        let new_amount_paid = parseInt(invoice_data.amount_paid) + parseInt(invoice_data.amount_to_pay);
        let new_invoice_amount = parseInt(invoice_data.invoice_amount) - parseInt(invoice_data.amount_to_pay);
        // , invoice_amount = " + new_invoice_amount +" 
        var sqlQuery = "UPDATE invoice SET amount_paid = " + new_amount_paid + " WHERE invoice_id = " + invoice_data.invoice_id;
        sql.query(sqlQuery, function (err, res) {
            if (err) {
                sql.rollback(function () {
                    throw err;
                });
            } else {
                let new_supplier_amount = parseInt(invoice_data.supplier_amount) - parseInt(invoice_data.amount_to_pay);
                let update_supplier_amount = { 'new_supplier_amount': new_supplier_amount, 'supplier_id': invoice_data.supplier_id };

                supplierModel.updateAmount(update_supplier_amount, function (err, response) {
                    if (err) {
                        sql.rollback(function () {
                            throw err;
                        });
                    } else {
                        sql.query('SELECT store_entry_id, remain_amount from store_entry ORDER BY store_entry_id DESC LIMIT 1', function (err, res) {
                            if (err || res.length == 0) {
                                throw err;
                            } else {
                                let new_remain_amount = res[0].remain_amount - parseInt(invoice_data.amount_to_pay);
                                let update_remain_amount_query = 'UPDATE store_entry SET remain_amount = ' + new_remain_amount + ' WHERE store_id = ' + invoice_data.store_id + ' ORDER BY store_entry_id DESC LIMIT 1';
                                sql.query(update_remain_amount_query, function (err, res) {
                                    if (err) {
                                        sql.rollback(function () {
                                            throw err;
                                        });
                                    } else {
                                        let new_drawer_amount = parseInt(invoice_data.drawer_amount) - parseInt(invoice_data.amount_to_pay);
                                        var update_drawer_amount = { 'new_drawer_amount': new_drawer_amount, 'store_id': invoice_data.store_id };
                                        storeModel.updateDrawerAmount(update_drawer_amount, function (err, response) {
                                            if (err) {
                                                sql.rollback(function () {
                                                    throw err;
                                                })
                                            } else {
                                                sql.query('SELECT store_entry_id FROM store_entry ORDER BY store_entry_id DESC LIMIT 1', function (err, res) {
                                                    if (err || res.length == 0) {
                                                        sql.rollback(function () {
                                                            throw err;
                                                        })
                                                    } else {
                                                        if (res.length === 1) {
                                                            let payment_data = { 'store_entry_id': res[0].store_entry_id, 'invoice_id': invoice_data.invoice_id, 'payment_amount': invoice_data.amount_to_pay, 'payment_date': new Date(invoice_data.invoice_date) }
                                                            sql.query('INSERT INTO invoice_payment SET ?', payment_data, function (err, res) {
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
                                                    }
                                                })
                                            }
                                        })
                                    }
                                });
                            }
                        })
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

Invoice.getAvailableInvoiceToPay = function (supplier_data, result) {
    let supplier_id = supplier_data.supplier_id;
    console.log(supplier_data)
    let amount_to_pay = parseInt(supplier_data.amount_to_pay);

    /* IMPORTANT >>>>> ADD STORE ID TO THE QUERY AS IN getUnpaidInvoices */

    let sqlQuery = 'SELECT inv.*,sup.*,st.* from invoice as inv left join supplier as sup on inv.supplier_id = sup.supplier_id left join store as st on inv.store_id = st.store_id where inv.supplier_id = ' + supplier_id + ' AND inv.invoice_amount > ' + amount_to_pay + ' AND inv.is_paid != 1 AND inv.check_id is NULL';
    console.log(sqlQuery)
    sql.query(sqlQuery, function (err, res) {
        if (err) {
            result(err);
        } else {
            let new_res = [];
            for (let i = 0; i < res.length; i++) {
                if ((res[i].amount_paid + parseInt(amount_to_pay)) < res[i].invoice_amount) {
                    new_res.push(res[i]);
                }
            }
            result(new_res);
        }
    });
}

Invoice.getUnpaidInvoices = function (data, result) {
    let supplier_id = data.supplier_id;
    let amount_to_pay = parseInt(data.amount_to_pay);
    let store_id = data.store_id
    let sqlQuery = 'SELECT inv.*,sup.*,st.* from invoice as inv left join supplier as sup on inv.supplier_id = sup.supplier_id left join store as st on inv.store_id = st.store_id where inv.supplier_id = ' + supplier_id + ' AND inv.store_id = ' + store_id + ' AND inv.is_paid != 1 AND inv.check_id is NULL';

    sql.query(sqlQuery, function (err, res) {
        if (err) {
            result(err);
        } else {
            result(res);
        }
    });
}

Invoice.getInvoiceByNumber = function (invoice_data, result) {
    let invoice_number = invoice_data.invoice_number;
    let supplier_id = invoice_data.supplier_id;
    let sqlQuery = '';
    if (invoice_number == '') {
        sqlQuery = 'SELECT invoice_id,invoice_number,invoice_amount from invoice where invoice_number like "% %"';
    } else {
        let supplier_id_condition = "";
        if (supplier_id != '') {

            supplier_id_condition = "supplier_id = " + supplier_id + " AND ";
        } else {
            supplier_id_condition = "supplier_id = " + "' '" + " AND ";
        }
        sqlQuery = 'SELECT invoice_id,invoice_number,invoice_amount from invoice where ' + supplier_id_condition + 'invoice_number like "%' + invoice_number + '%" and check_id IS NULL AND amount_paid = 0 LIMIT 10';
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
        sql_and = sql_and + ' AND inv.is_paid = 1 or inv.amount_paid > 0';
    }
    else if (data.is_paid == 'unpaid') {
        sql_and = sql_and + ' AND inv.check_id is NULL AND inv.is_paid = 0';
    } else if (data.is_paid == 'partially_paid') {
        sql_and = sql_and + ' AND inv.amount_paid > 0';
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