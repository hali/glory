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

Player.getDebts = function (result) {
        sql.query("select subquery.post_id, subquery.name, subquery.ep_id, pl.id as player_id from\
        (select max(p2.id) as post_id, e.name, e.id as ep_id \
        from episode e, posts p2 \
        where p2.episode_id = e.id\
        and e.status_id = 3\
        group by e.name, e.id order by e.name) as subquery, \
        player pl, `character` ch, posts p2 \
        where ch.player_id = pl.id \
       and p2.id = subquery.post_id \
       and p2.author_id = ch.id", 
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

Player.getEpisodesById = function (playerId, statusId, result) {
        sql.query("select e.id, e.name, e.status_id, es.description as status, \
           DATE_FORMAT(e.timeOfAction, '%d %M %Y') as timeOfAction, e.timeOfAction as time\
           from episode e, `character` c, player pl, posts p,\
			episode_status es WHERE \
			pl.id = c.player_id \
			and e.id = p.episode_id \
			and es.id = e.status_id \
			and es.id = ?\
			and p.author_id = c.id \
			and pl.id = ? \
			UNION \
			select e2.id, e2.name, e2.status_id, es.description as status,  \
			DATE_FORMAT(e2.timeOfAction, '%d %M %Y') as timeOfAction, e2.timeOfAction as time\
			from episode e2, player p2, episode_status es WHERE \
			e2.author_id = p2.id \
			and es.id = e2.status_id \
			and es.id = ?\
			and p2.id = ?\
			order by time asc",
	[playerId, statusId, statusId, playerId], function (err, res) {             
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

Player.getMyCommentsById = function (playerId, result) {
        sql.query("select c.id, c.body, c.post_id, DATE_FORMAT(c.added_time, '%d %M %Y %h:%i') as added_time, e.name as ep_name, \
        c2.name as char_name, e.id as ep_id \
        from comments c, posts p, episode e, `character` c2  \
        where c.author_id = ?\
        and c.post_id = p.id \
        and p.episode_id = e.id \
        and c2.id = p.author_id \
        order by c.added_time desc;",
	    [playerId], function (err, res) {             
                if(err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                else{
                    result(null, res);
              
                }
            });   
};

Player.getMyFeedbackById = function (playerId, result) {
        sql.query("select c.id, p.episode_id, e.name, c.author_id, pl.nickname, c.body, \
            DATE_FORMAT(c.added_time, '%d %M %Y %H:%i') as added_time, p.id as post_id \
			from comments c, player pl, posts p, `character` c2, player p2, episode e  \
			where c.author_id = pl.id\
			and c.post_id = p.id\
			and p.author_id = c2.id \
			and c2.player_id = p2.id \
			and e.id = p.episode_id\
			and p2.id = ?\
			order by c.added_time desc",
	[playerId], function (err, res) {             
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
