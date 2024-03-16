'user strict';
var sql = require('./db.js');

//Topic object constructor
var Topic = function(topic){
    this.id = topic.id;
    this.name = topic.name;
    this.description = topic.description;
    this.status_id = topic.status_id;
    this.added_time = topic.added_time;
    this.author_id = topic.author_id;
};

Topic.createTopic = function (t, result) {    	
	var sqlstring = "REPLACE INTO topics (name, description, status_id, added_time, author_id) \
    VALUES (?, ?, ?, NOW(), ?);";
    
    sql.query(sqlstring, 
	[t.name, t.description, t.status_id, t.author_id],
	function (err, res) {            
        if(err) {
            consolt.log("error: ", err);
            result(err, null);
        } else{
            result(null, res.insertId);
        }
    });           
};

Topic.updateTopic = function (t_id, t, result) {    	
	var sqlstring = "UPDATE topic SET\
	name = ?, \
	description = ?, \
	WHERE id = ?;";
    
    sql.query(sqlstring, 
	[t.name, t.description, t_id],
	function (err, res) {            
        if(err) {
            consolt.log("error: ", err);
            result(err, null);
        } else{
            result(null, res.insertId);
        }
    });           
};

Topic.setTopicStatus = function (t_id, t_status, result) {    	    
    sql.query("UPDATE topic SET status_id = ? WHERE id = ?", 
	[t_status, t_id],
	function (err, res) {            
        if(err) {
            consolt.log("error: ", err);
            result(err, null);
        } else{
            result(null, res.insertId);
        }
    });           
};

Topic.listTopics = function(status_id, result) {
    var sqlQuery = "select t.id, t.name, t.status_id, t.author_id, \
    DATE_FORMAT(t.added_time, '%d %M %Y') as addedTime, count(r.id) as replies_n\
	from topics t, replies r";
	sqlQuery += " WHERE t.id = r.topic_id";
	if (status_id != 0) sqlQuery += " AND t.status_id = ?"
	 else sqlQuery += " AND 0 = ?";
	sqlQuery += " group by t.id, t.author_id, t.status_id, t.name, t.added_time order by t.added_time asc";
	sql.query(sqlQuery, 
	[status_id],
	function (err, res) {

    if(err) {
        console.log("error: ", err);
        result(null, err);
    } else {
		result(null, res);
    }
}); 
};

Topic.getReplies = function(topic_id, result) {
	sql.query("select r.id, r.body, pl.id as player_id, pl.nickname, \
	            DATE_FORMAT(r.added_time, '%d %M %Y %H:%i') as added_time\
				from replies r, player pl  \
				where r.author_id = pl.id  \
				and r.topic_id = ? \
				order by r.id asc", 
		topic_id,
		function (err, res) {
	
		if(err) {
			console.log("error: ", err);
			result(null, err);
		} else {
			result(null, res);
		}
	}); 
};

Topic.addReply = function (reply, result) {    	
	var sqlstring = "INSERT INTO replies (author_id, topic_id, body, added_time) \
    VALUES (?, ?, ?, ?);";
    
    sql.query(sqlstring, 
	[reply.author_id, reply.topic_id, reply.body, reply.added_time],
	function (err, res) {            
        if(err) {
            console.log("error: ", err);
            result(err, null);
        } else{
            result(null, res.insertId);
        }
    });           
};

module.exports= Topic;