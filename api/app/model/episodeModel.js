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
	var sqlstring = "REPLACE INTO episode (name, description, branch_id, status_id, world, timeOfAction, author_id) \
    VALUES (?, ?, ?, ?, ?, ?, ?);";
    
    sql.query(sqlstring, 
	[ep.name, ep.description, ep.branch_id, ep.status_id, ep.world, ep.time_of_action, ep.author_id],
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

Episode.listEpisodesByCharacterId = function(character_id, result) {
	sql.query("select e.id, e.name, REPLACE(e.url, 'http:', 'https:') as \"url\", es.description as status, b.description as branch \
	from episode e, participants p, episode_status es, branch b where \
	p.episode_id = e.id \
	AND e.status_id = es.id \
	AND b.id = e.branch_id \
	AND p.character_id = ? \
	AND b.id < 100 \
	order by CONVERT(SUBSTRING_INDEX(url, '?id=', -1), UNSIGNED INTEGER)", 
	character_id,
	function (err, res) {

    if(err) {
        console.log("error: ", err);
        result(null, err);
    } else {
		result(null, res);
    }
}); 
};

Episode.listEpisodes = function(status_id, branch_id, result) {
    var sqlQuery = "select e.id, e.name, e.world, es.description as status, b.description as branch, e.branch_id, \
    DATE_FORMAT(e.timeOfAction, '%d %M %Y') as timeOfAction\
	from episode e, episode_status es, branch b\
	WHERE e.status_id = es.id \
	AND b.id = e.branch_id";
	if (status_id != 0) sqlQuery += " AND e.status_id = ?"
	 else sqlQuery += " AND 0 = ?";
	if (branch_id != 0) sqlQuery += " AND e.branch_id = ?";
	 else sqlQuery += " AND 0 = ?";
	sqlQuery += " order by branch, e.timeOfAction asc";
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

Episode.getEpisode = function(episode_id, result) {
	sql.query("select e.name, e.description, e.world, e.timeOfAction, b.description as 'branch', es.description as 'status', \
	e.author_id \
	from episode e, branch b, episode_status es, player pl \
	where e.id = ? \
	and e.status_id = es.id \
	and e.branch_id = b.id \
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
module.exports= Episode;
