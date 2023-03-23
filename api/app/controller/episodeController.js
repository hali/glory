'use strict';

var Episode = require('../model/episodeModel.js');

exports.create_an_episode = function(req, res) {
  var new_episode = new Episode(req.body);

  //handles null error 
   if ( !new_episode.name || !new_episode.status_id || !new_episode.author_id ) {
            res.status(400).send({ error:true, message: 'Please provide name, status and author' });
        }
else { 
  		Episode.createEpisode(new_episode, function(err, episode) {    
    	if (err)
      		res.send(err);	
    	res.json(episode);
  	});
  };
};

exports.list_episodes = function(req, res) {
  var branch = 0;
  var status = 0;
  if (req.query.status) status = req.query.status;
  if (req.query.branch) branch = req.query.branch;
  Episode.listEpisodes(status, branch, function(err, response) {
    if (err)
      res.send(err);  
    res.json(response);
  });
};

exports.list_latest = function(req, res) {
  Episode.listLatest(function(err, response) {
    if (err)
      res.send(err);  
    res.json(response);
  });
};

exports.read_episode = function(req, res) {
  Episode.getEpisode(req.params.episodeId, function(err, posts) {
    if (err)
      res.send(err);  
    res.json(posts);
  });
}

exports.get_branches = function(req, res) {
  Episode.getBranches(req.params.episodeId, function(err, posts) {
    if (err)
      res.send(err);  
    res.json(posts);
  });
}

exports.update_branches = function(req, res) {
  Episode.updateBranches(req.params.episodeId, req.body, function(err, response) {
    if (err)
      res.send(err);  
    res.json(response);
  });
}

exports.branches = function(req, res) {
  Episode.getAllBranches(function(err, branches) {
    if (err)
      res.send(err);  
    res.json(branches);
  });
}

exports.close_episode = function(req, res) {
  Episode.setEpisodeStatus(req.params.episodeId, 2, function(err, response) {
    if (err)
      res.send(err);  
    res.json(response);
  });
}

exports.reopen_episode = function(req, res) {
  Episode.setEpisodeStatus(req.params.episodeId, 3, function(err, response) {
    if (err)
      res.send(err);  
    res.json(response);
  });
}

exports.update_episode = function(req, res) {
  var new_episode = new Episode(req.body);

  //handles null error 
   if ( !new_episode.name) {
            res.status(400).send({ error:true, message: 'Please provide name' });
        }
else { 
  		Episode.updateEpisode(parseInt(req.params.episodeId), new_episode, function(err, episode) {    
    	if (err)
      		res.send(err);	
    	res.json(episode);
  	});
  };
};