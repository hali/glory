'use strict';
module.exports = function(app) {
  var characterList = require('../controller/characterController');
  var episodesList = require('../controller/episodeController');
  var postsList = require('../controller/postController');
  var playersList = require('../controller/playerController');

  // characters routes
  app.route('/api/characters')
    .post(characterList.add_character)
    .get(characterList.get_characters);
  app.route('/api/characters/:id')
    .post(characterList.update_character)
    .get(characterList.get_character);  
 
  // episodes routes
  app.route('/api/episodes')
    .post(episodesList.create_an_episode)
    .get(episodesList.list_episodes);
  app.route('/api/episodes/:episodeId')
    .get(episodesList.read_episode)
    .post(episodesList.update_episode);
  app.route('/api/episodes/:episodeId/close')
    .post(episodesList.close_episode);  
  app.route('/api/episodes/:episodeId/reopen')
    .post(episodesList.reopen_episode);  
    
  // posts routes
  app.route('/api/posts')
    .post(postsList.add_post);
  app.route('/api/episodes/:episodeId/posts')
    .get(postsList.list_posts_by_episode_id);  
  app.route('/api/posts/:postId')
    .get(postsList.view_post)
    .post(postsList.update_post);   
  app.route('/api/posts/:postId/delete')
    .post(postsList.delete_post);
    
  //player routes
  app.route('/api/players/:playerId/characters')
  	.get(characterList.list_characters); 
  app.route('/api/players')
    .get(playersList.get_player)
    .post(playersList.add_player);		
  app.route('/api/players/:playerId/episodes')
  	.get(playersList.get_episodes); 	
  
};  
    