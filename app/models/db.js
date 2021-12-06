'user strict';

var mysql = require('mysql');
//local mysql db connection

var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',//'petitem',
      password : '',//'U<U[{Bc+C!3sdRn2{{2t}?#m',
      database : 'sicomex-stores-new'
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});
module.exports = connection;