'use strict';

var Player = require('../model/playerModel.js');

exports.add_player = function(req, res) {
  Player.addPlayer(new Player(req.body), function(err, player) {
    if (err)
      res.send(err);
    res.json(player);
  });
};

exports.get_debts = function(req, res) {
  Player.getDebtsById(req.params.playerId, function(err, debts) {
    if (err)
      res.send(err);  
    res.json(debts);
  });
};

exports.get_debtors = function(req, res) {
  Player.getDebtorsById(req.params.playerId, function(err, debtors) {
    if (err)
      res.send(err);  
    res.json(debtors);
  });
};

exports.get_player = function(req, res) {
  if (req.query.email)
	  Player.getPlayerByEmail(req.query.email, function(err, response) {
		if (err)
		  res.send(err);  
		res.json(response);
	  });
   else if (req.query.id)
    Player.getPlayerById(req.query.id, function(err, response) {
		if (err)
		  res.send(err);  
		res.json(response);
	  });
	else  
	   Player.listPlayers(function(err, players) {
		if (err)
		  res.send(err);  
		res.json(players);
	  });  
};

exports.get_episodes = function(req, res) {
  Player.getEpisodesById(req.params.playerId, function(err, episodes) {
    if (err)
      res.send(err);  
    res.json(episodes);
  });
};

exports.get_characters = function(req, res) {
  Player.getCharactersById(req.params.playerId, function(err, characters) {
    if (err)
      res.send(err);  
    res.json(characters);
  });
};

exports.get_comments = function(req, res) {
  Player.getMyCommentsById(req.params.playerId, function(err, comments) {
    if (err)
      res.send(err);  
    res.json(comments);
  });
};

exports.get_feedback = function(req, res) {
  Player.getMyFeedbackById(req.params.playerId, function(err, comments) {
    if (err)
      res.send(err);  
    res.json(comments);
  });
};