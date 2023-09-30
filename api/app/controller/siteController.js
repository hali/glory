'use strict';

var Site = require('../model/siteModel.js');

exports.get_episodes_count = function(req, res) {
	Site.getEpisodesCount(function(err, response) {    
		if (err)
			res.send(err);	
		res.json(response);
  	});
};

exports.get_characters_count = function(req, res) {
	Site.getCharactersCount(function(err, response) {    
		if (err)
			res.send(err);	
		res.json(response);
  	});
};

exports.get_posts_count = function(req, res) {
	Site.getPostsCount(function(err, response) {    
		if (err)
			res.send(err);	
		res.json(response);
  	});
};