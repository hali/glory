'user strict';
var sql = require('./db.js');

//Player object constructor
var Player = function(player){
    this.id = player.id;
    this.email = player.email;
    this.info = player.info;
    this.post = player.post;
    this.nickname = player.nickname;
};

Player.addPlayer = function (player, result) {  
    console.log(player);  	
    sql.query("INSERT INTO player (id, email, info, post) VALUES (?, ?, ?, ?) \
    ON DUPLICATE KEY UPDATE \
    info = ?, post = ?, nickname = ?", 
	[player.id, player.email, player.info, player.post, player.info, player.post, player.nickname],
	function (err, res) {            
        if(err) {
            console.log("error: ", err);
            result(err, null);
        } else{
            result(null, res.insertId);
        }
    });           
};

Player.getDebtsById = function (playerId, result) {
        sql.query("select p.episode_id, c.name as character_name, e.name as episode_name, \
        REPLACE(e.url, 'http:', 'https:') as episode_url, b.description as branch\
	from episode e, participants p, branch b, player p2, `character` c where \
	p.episode_id = e.id \
	AND b.id = e.branch_id AND e.status_id  = 3 \
	AND IFNULL(e.branch_id, 1) < 100 \
	AND p2.id = ?\
	AND c.player_id = p2.id\
	AND p.character_id = c.id AND e.last_responder != p.character_id ", 
	playerId, function (err, res) {             
                if(err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                else{
                    result(null, res);
              
                }
            });   
};

Player.getDebtorsById = function (playerId, result) {
        sql.query("select c.name as debtor_name, c2.name as character_name, e.id as episode_id, e.name as episode_name, REPLACE(e.url, 'http:', 'https:') as episode_url, b.description as branch\
	from episode e, participants p, branch b, `character` c, `character` c2, player p2 where \
	p2.id = ?\
	AND c2.player_id = p2.id \
	AND p.character_id = c.id \
	AND p.episode_id = e.id \
	AND b.id = e.branch_id \
	AND IFNULL(e.branch_id, 1) < 100 \
	AND e.status_id  = 3 \
	AND e.last_responder != p.character_id \
	AND c2.id = e.last_responder", 
	playerId, function (err, res) {             
                if(err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                else{
                    result(null, res);
              
                }
            });   
};

Player.getCharactersById = function (playerId, result) {
        sql.query("select * from `character` where player_id = ?", 
	playerId, function (err, res) {             
                if(err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                else{
                    result(null, res);
              
                }
            });   
};

Player.getEpisodesById = function (playerId, result) {
        sql.query("select e.id, e.name, e.branch_id, b.description as branch, e.status_id, es.description as status, \
           DATE_FORMAT(e.timeOfAction, '%d %M %Y') as timeOfAction, e.timeOfAction as time\
           from episode e, `character` c, player pl, posts p,\
			branch b, episode_status es WHERE \
			pl.id = c.player_id \
			and e.id = p.episode_id \
			and es.id = e.status_id \
			and b.id = e.branch_id \
			and p.author_id = c.id \
			and pl.id = ? \
			UNION \
			select e2.id, e2.name, e2.branch_id, b.description as branch, e2.status_id, es.description as status,  \
			DATE_FORMAT(e2.timeOfAction, '%d %M %Y') as timeOfAction, e2.timeOfAction as time\
			from episode e2, player p2, branch b, episode_status es WHERE \
			e2.author_id = p2.id \
			and es.id = e2.status_id \
			and b.id = e2.branch_id \
			and p2.id = ?\
			order by branch, time asc",
	[playerId, playerId], function (err, res) {             
                if(err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                else{
                    result(null, res);
              
                }
            });   
};

Player.getPlayerByEmail = function (playerEmail, result) {
        sql.query("select id, nickname, email, info, post from player where email = ?", 
	playerEmail, function (err, res) {             
                if(err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                else{
                    result(null, res);
              
                }
            });   
};

Player.getPlayerById = function (playerId, result) {
        sql.query("select id, nickname, email, info, post from player where id = ?", 
	playerId, function (err, res) {             
                if(err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                else{
                    result(null, res);
              
                }
            });   
};

Player.listPlayers = function (result) {
        sql.query("select id, nickname, info, post from player", 
	    function (err, res) {             
                if(err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                else{
                    result(null, res);
              
                }
            });   
};

module.exports= Player;
