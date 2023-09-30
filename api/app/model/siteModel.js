'user strict';
var sql = require('./db.js');

var Site = function(site){
    this.body = site.body;
};

Site.getEpisodesCount = function(result) {
	sql.query("select count(*) as episodes_n from episode", 
	function (err, res) {

    if(err) {
        console.log("error: ", err);
        result(null, err);
    } else {
		result(null, res);
    }
}); 
};

Site.getCharactersCount = function(result) {
	sql.query("select count(*) as characters_n from `character`", 
	function (err, res) {

    if(err) {
        console.log("error: ", err);
        result(null, err);
    } else {
		result(null, res);
    }
}); 
};

Site.getPostsCount = function(result) {
	sql.query("select count(*) as posts_n from posts", 
	function (err, res) {

    if(err) {
        console.log("error: ", err);
        result(null, err);
    } else {
		result(null, res);
    }
}); 
};

module.exports = Site;