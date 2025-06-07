'user strict';

var mysql = require('mysql2');
var config = require('../../config');

// Add specific connection options for mysql2
const poolConfig = {
    ...config.pool,
    // Enable proper authentication method negotiation
    authPlugins: {
        mysql_native_password: () => () => {
            return Buffer.from(config.pool.password);
        }
    }
};

var pool = mysql.createPool(poolConfig);

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