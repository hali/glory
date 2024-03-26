'user strict';
var sql = require('./db.js');

//Comment object constructor
var Email = function(email){
    this.body = email.body;
};

Email.addSubscription = function (episode_id, player_id, result) {    	
    sql.query("replace into subscriptions (episode_id, player_id) values (?, ?)", 
	[episode_id, player_id],
	function (err, res) {            
        if(err) {
            console.log("error: ", err);
            result(err, null);
        } else{
            result(null, res.insertId);
        }
    });           
};

Email.getRecipients = function(episode_id, player_id, result) {
	sql.query("select p.email as Email, p.nickname as Name\
	from subscriptions sc, player p \
	where sc.player_id = p.id\
	and sc.episode_id = ?\
	and sc.player_id != ?", 
	[episode_id, player_id],
	function (err, res) {

    if(err) {
        console.log("error: ", err);
        result(null, err);
    } else {
		result(null, res);
    }
}); 
};

Email.checkSubscription = function(episode_id, player_id, result) {
	sql.query("select count(*) as c\
	from subscriptions \
	where player_id = ?\
	and episode_id = ?", 
	[player_id, episode_id],
	function (err, res) {

    if(err) {
        console.log("error: ", err);
        result(null, err);
    } else {
		result(null, res);
    }
}); 
};

Email.deleteSubscription = function(episode_id, player_id, result) {
	sql.query("delete \
	from subscriptions \
	where player_id = ?\
	and episode_id = ?", 
	[player_id, episode_id],
	function (err, res) {

    if(err) {
        console.log("error: ", err);
        result(null, err);
    } else {
		result(null, res);
    }
}); 
};

module.exports= Email;