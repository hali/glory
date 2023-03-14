'user strict';
var sql = require('./db.js');

//Post object constructor
var Post = function(post){
    this.id = post.id;
    this.body = post.body;
    this.episode_id = post.episode_id;
    this.author_id = post.author_id;
    this.added_time = post.added_time;
};

Post.createPost = function (post, result) {    	
	var sqlstring = "REPLACE INTO posts (author_id, episode_id, body, added_time) \
    VALUES (?, ?, ?, ?);";
    
    sql.query(sqlstring, 
	[post.author_id, post.episode_id, post.body, post.added_time],
	function (err, res) {            
        if(err) {
            console.log("error: ", err);
            result(err, null);
        } else{
            result(null, res.insertId);
        }
    });           
};

Post.listPostsByEpisodeId = function(episode_id, result) {
	sql.query("select p.id, p.body, c.id as char_id, pl.id as player_id, c.name, c.status, \
	            TIMESTAMPDIFF(YEAR, c.dob, e.timeOfAction) as age, c.img, \
	            DATE_FORMAT(p.added_time, '%d %M %Y %H:%i') as added_time\
				from posts p, `character` c, episode e, player pl  \
				where p.author_id = c.id  \
				and p.episode_id = e.id \
				and pl.id = c.player_id \
				and e.id = ? \
				order by p.id asc", 
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

Post.updatePost = function (post_id, post, result) {    	
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

Post.getPost = function(post_id, result) {
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

Post.deletePost = function(post_id, result) {
	sql.query("delete from posts where id=?",
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

module.exports= Post;