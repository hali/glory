'user strict';

var mysql = require('mysql');
var config = require('../../config');

var pool      =    mysql.createPool(config.pool);  

exports.query=function(query, params, callback){
    pool.getConnection(function(err,connection){
        if (err) {
        	console.log("Could not get connection: " + err);
            callback(true);
            return;
        }   
        connection.query(query, params, function(err,rows){
//        	console.log("QUERY: " + query);
            connection.release();
            if(!err) {
                callback(null, rows);
            } else {
            	callback(err, null);
                console.log(err);

            	}          
        });
    });
}