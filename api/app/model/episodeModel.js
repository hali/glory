var cyrillicToTranslit = require('cyrillic-to-translit-js');

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
    var sqlQuery = "select e.id, e.name, e.world, GROUP_CONCAT(eb.branch_id) AS branch_ids, es.description as status, \
    DATE_FORMAT(e.timeOfAction, '%d %M %Y') as dateOfAction\
	from episode_status es, episode e LEFT JOIN episode_branch eb ON e.id = eb.episode_id";
	sqlQuery += " WHERE e.status_id = es.id";
	if (branch_id != 0) sqlQuery += " AND e.id IN (\
    SELECT DISTINCT episode_id\
    FROM episode_branch\
    WHERE branch_id = " + branch_id + ")";
    if (status_id != 0) sqlQuery += " AND e.status_id = " + status_id;
	sqlQuery += " group by e.id, e.name, e.world, status, dateOfAction" 
	sqlQuery += " order by e.timeOfAction asc";
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

Episode.listLatest = function(result) {
    var sqlQuery = "select e.id, e.name, DATE_FORMAT(p.added_time, '%d %M %Y %H:%i') as added_time, \
    c.name as char_name, p.id as post_id  \
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

Episode.getAllBranches = function(result) {
	sql.query("select b.id, b.description from branch b",
	function (err, res) {
		if (err) {
			console.log("error: ", err);
        	result(null, err);
    	} else {
			result(null, res);
		}	
	});
};

Episode.updateBranches = function (ep_id, branches, result) {    	
	var sqlstring = "DELETE from episode_branch where episode_id = " + ep_id;
	sqlstring += "; REPLACE into episode_branch values ";
	let cl = new Array(Object.values(branches))[0];
	cl.forEach((branch_id, index) => {
	    if (index != 0) sqlstring += ", ";
	    sqlstring += "(" + ep_id + ", " + branch_id + ")";
	});
    
    sql.query(sqlstring, 
	function (err, res) {            
        if(err) {
            console.log("error: ", err);
            result(err, null);
        } else{
            result(null, res.insertId);
        }
    });           
};

Episode.updatePostDraft = function (ep_id, body, result) {    	
    sql.query("REPLACE into drafts (episode_id, player_id, text) values (?, ?, ?)", 
    [ep_id, body.player_id, body.draft],
	function (err, res) {            
        if(err) {
            console.log("error: ", err);
            result(err, null);
        } else{
            result(null, res.insertId);
        }
    });           
};

Episode.getDraft = function (ep_id, player_id, result) {    	
    sql.query("SELECT text from drafts where episode_id = ? and player_id = ?", 
    [ep_id, player_id],
	function (err, res) {            
        if(err) {
            console.log("error: ", err);
            result(err, null);
        } else{
            result(null, res);
        }
    });           
};

Episode.deleteDraft = function (ep_id, player_id, result) {    	
    sql.query("DELETE from drafts where episode_id = ? and player_id = ?", 
    [ep_id, player_id],
	function (err, res) {            
        if(err) {
            console.log("error: ", err);
            result(err, null);
        } else{
            result(null, res.insertId);
        }
    });           
};

Episode.addBranch = function (branch, result) {   
    const b_name = cyrillicToTranslit().transform(branch, '_').toLowerCase(); 	
    sql.query("INSERT INTO branch (name, description) values (?, ?)", [b_name, branch], 
	function (err, res) {            
        if(err) {
            console.log("error: ", err);
            result(err, null);
        } else{
            result(null, res.insertId);
        }
    });           
};

module.exports= Episode;
