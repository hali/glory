'user strict';

var mysql = require('mysql');

var pool      =    mysql.createPool({
    connectionLimit : 6,
    host     : '34.77.35.228',
//    socketPath: '/cloudsql/trpg-buddy:europe-west1:mydb',
    user     : 'apiUser',
    password : 'thecity',
    database : 'gloryDB',
    debug    :  false,
    multipleStatements: true
});  

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