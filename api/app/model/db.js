'user strict';

var mysql = require('mysql');
var config = require('../../config');

var pool      =    mysql.createPool(config.pool);  

exports.query=function(query, params, callback){
	pool.query(query, params, function(err,rows){
        	//console.log("QUERY: " + query);
		if(!err) {
			callback(null, rows);
		} else {
			callback(err, null);
			console.log(err);

			}          
	});
}