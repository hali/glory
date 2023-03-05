'user strict';
var sql = require('./db.js');

//Episode object constructor
var Episode = function(episode){
    this.id = episode.id;
    this.name = episode.name;
    this.description = episode.description;
    this.branch_id = episode.branch_id;
    this.status_id = episode.status_id;
    this.world = episode.world;
    this.time_of_action = episode.time_of_action;
    this.author_id = episode.author_id;
};

Episode.createEpisode = function (ep, result) {    	
	var sqlstring = "REPLACE INTO episode (name, description, status_id, world, timeOfAction, author_id) \
    VALUES (?, ?, ?, ?, ?, ?);";
    
    sql.query(sqlstring, 
	[ep.name, ep.description, ep.status_id, ep.world, ep.time_of_action, ep.author_id],
	function (err, res) {            
        if(err) {
            console.log("error: ", err);
            result(err, null);
        } else{
            result(null, res.insertId);
        }
    });           
};

Episode.updateEpisode = function (ep_id, ep, result) {    	
	var sqlstring = "UPDATE episode SET\
	name = ?, \
	description = ?, \
	world = ?, \
	timeOfAction = ?\
	WHERE id = ?;";
    
    sql.query(sqlstring, 
	[ep.name, ep.description, ep.world, ep.time_of_action, ep_id],
	function (err, res) {            
        if(err) {
            console.log("error: ", err);
            result(err, null);
        } else{
            result(null, res.insertId);
        }
    });           
};

Episode.setEpisodeStatus = function (ep_id, ep_status, result) {    	    
    sql.query("UPDATE episode SET status_id = ? WHERE id = ?", 
	[ep_status, ep_id],
	function (err, res) {            
        if(err) {
            console.log("error: ", err);
            result(err, null);
        } else{
            result(null, res.insertId);
        }
    });           
};

Episode.listEpisodes = function(status_id, branch_id, result) {
    var sqlQuery = "select e.id, e.name, e.world, es.description as status, \
    DATE_FORMAT(e.timeOfAction, '%d %M %Y') as timeOfAction\
	from episode e, episode_status es";
	if (branch_id != 0) sqlQuery += ", episode_branch eb"
	sqlQuery += " WHERE e.status_id = es.id";
	if (status_id != 0) sqlQuery += " AND e.status_id = ?"
	 else sqlQuery += " AND 0 = ?";
	if (branch_id != 0) sqlQuery += " AND eb.episode_id = e.id AND eb.branch_id = ?";
	 else sqlQuery += " AND 0 = ?";
	sqlQuery += " order by e.timeOfAction asc";
	sql.query(sqlQuery, 
	[status_id, branch_id],
	function (err, res) {

    if(err) {
        console.log("error: ", err);
        result(null, err);
    } else {
		result(null, res);
    }
}); 
};

Episode.listLatest = function(result) {
    var sqlQuery = "select e.id, e.name, DATE_FORMAT(p.added_time, '%d %M %Y %H:%i') as added_time, c.name as char_name  \
    from episode e, posts p, `character` c  \
    where e.id = p.episode_id\
    and p.author_id = c.id \
    order by p.added_time desc limit 10";
	sql.query(sqlQuery, 
	function (err, res) {

    if(err) {
        console.log("error: ", err);
        result(null, err);
    } else {
		result(null, res);
    }
}); 
};

Episode.getEpisode = function(episode_id, result) {
	sql.query("select e.name, e.description, e.world, e.timeOfAction, es.description as 'status', \
	e.author_id \
	from episode e, episode_status es, player pl \
	where e.id = ? \
	and e.status_id = es.id \
	and e.author_id = pl.id",
	episode_id,
	function (err, res) {
		if (err) {
			console.log("error: ", err);
        	result(null, err);
    	} else {
			result(null, res);
		}	
	});
};

Episode.getBranches = function(episode_id, result) {
	sql.query("select b.id, b.description from episode_branch eb, branch b\
	where b.id = eb.branch_id and eb.episode_id = ?",
	episode_id,
	function (err, res) {
		if (err) {
			console.log("error: ", err);
        	result(null, err);
    	} else {
			result(null, res);
		}	
	});
};

module.exports= Episode;
