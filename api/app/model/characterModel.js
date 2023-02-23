'user strict';
var sql = require('./db.js');

//Character object constructor
var Character = function(character){
    this.id = character.id;
    this.name = character.name;
    this.dob = character.dob;
    this.player_id = character.player_id;
    this.branch_id = character.branch_id;
    this.info = character.info;
    this.status = character.status;
	this.img = character.img;	
};

Character.getCharacters = function(player_id, result) {
	sql.query("Select * from `character` where player_id = ? order by name asc", 
	[player_id],
	function (err, res) {
    if(err) {
        console.log("error: ", err);
        result(null, err);
    } else {
		result(null, res);
    }
}); 
};

Character.getAllCharacters = function(result) {
	sql.query("Select * from `character` order by name asc", 
	function (err, res) {
    if(err) {
        console.log("error: ", err);
        result(null, err);
    } else {
		result(null, res);
    }
}); 
};

Character.getCharacter = function(character_id, result) {
	sql.query("Select * from `character` where id = ? order by name asc", 
	[character_id],
	function (err, res) {
    if(err) {
        console.log("error: ", err);
        result(null, err);
    } else {
		result(null, res);
    }
}); 
};

Character.createCharacter = function (ch, result) {    	
	var sqlstring = "INSERT INTO `character` (name, dob, branch_id, player_id, info, img, status) \
    VALUES (?, ?, ?, ?, ?, ?, ?);";
    
    sql.query(sqlstring, 
	[ch.name, ch.dob, ch.branch_id, ch.player_id, ch.info, ch.img, ch.status],
	function (err, res) {            
        if(err) {
            console.log("error: ", err);
            result(err, null);
        } else{
            result(null, res.insertId);
        }
    });           
};

Character.updateCharacter = function (character_id, ch, result) {    	
	var sqlstring = "UPDATE `character` set \
	   name = ?, \
	   dob = ?, \
	   branch_id = ?, \
	   info = ?,\
	   img = ?,\
	   status = ? \
	   where id = ?";
    
    sql.query(sqlstring, 
	[ch.name, ch.dob, ch.branch_id, ch.info, ch.img, ch.status, character_id],
	function (err, res) {            
        if(err) {
            console.log("error: ", err);
            result(err, null);
        } else{
            result(null, res.insertId);
        }
    });           
};

module.exports= Character;
