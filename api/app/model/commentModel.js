'user strict';
var sql = require('./db.js');

//Comment object constructor
var Comment = function(comment){
    this.id = comment.id;
    this.body = comment.body;
    this.post_id = comment.post_id;
    this.author_id = comment.author_id;
};

Comment.createComment = function (post_id, comment, result) {    	
	var sqlstring = "INSERT INTO comments (author_id, post_id, body, added_time) \
    VALUES (?, ?, ?, NOW());";
    
    sql.query(sqlstring, 
	[comment.author_id, post_id, comment.body],
	function (err, res) {            
        if(err) {
            console.log("error: ", err);
            result(err, null);
        } else{
            result(null, res.insertId);
        }
    });           
};

Comment.listCommentsByPostId = function(post_id, result) {
	sql.query("select c.id, c.author_id, pl.nickname, c.body, c.added_time \
				from comments c, player pl\
				where c.author_id = pl.id\
				and c.post_id = ?\
				order by added_time desc", 
	episode_id,
	function (err, res) {

    if(err) {
        console.log("error: ", err);
        result(null, err);
    } else {
		result(null, res);
    }
}); 
};

Comment.updatePost = function (post_id, post, result) {    	
	var sqlstring = "UPDATE posts SET\
	body = ?\
	WHERE id = ?;";
    
    sql.query(sqlstring, 
	[post.body, post_id],
	function (err, res) {            
        if(err) {
            console.log("error: ", err);
            result(err, null);
        } else{
            result(null, res.insertId);
        }
    });           
};

Comment.getPost = function(post_id, result) {
	sql.query("select * from posts where id=?",
	[post_id],
	function (err, res) {
		if (err) {
			console.log("error: ", err);
        	result(null, err);
    	} else {
			result(null, res);
		}	
	});
};

module.exports= Comment;