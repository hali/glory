'use strict';

var Character = require('../model/characterModel.js');

exports.list_characters = function(req, res) {
  Character.getCharacters(req.params.playerId, function(err, character) {
    if (err)
      res.send(err);
    res.send(character);
  });
};

exports.get_characters = function(req, res) {
  Character.getAllCharacters(function(err, character) {
    if (err)
      res.send(err);
    res.send(character);
  });
};

exports.get_character = function(req, res) {
  Character.getCharacter(req.params.id, function(err, character) {
    if (err)
      res.send(err);
    res.send(character);
  });
};

exports.get_character_episodes = function(req, res) {
  Character.getCharacterEpisodes(req.params.id, function(err, episodes) {
    if (err)
      res.send(err);
    res.send(episodes);
  });
};

exports.add_character = function(req, res) {
  var new_character = new Character(req.body);

  //handles null error 
   if ( !new_character.name || !new_character.dob || !new_character.player_id ) {
            res.status(400).send({ error:true, message: 'Please provide name, Date of birth and player' });
        }
else { 
  		Character.createCharacter(new_character, function(err, character) {    
    	if (err)
      		res.send(err);	
    	res.json(character);
  	});
  };
};

exports.update_character = function(req, res) {
  var character = new Character(req.body);
  var character_id = req.params.id;

  //handles null error 
   if ( !character.name || !character.dob ) {
            res.status(400).send({ error:true, message: 'Please provide name and Date of birth' });
        }
else { 
  		Character.updateCharacter(character_id, character, function(err, character) {    
    	if (err)
      		res.send(err);	
    	res.json(character);
  	});
  };
};