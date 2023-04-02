'use strict';
module.exports = function(app) {
  var characterList = require('../controller/characterController');
  var episodesList = require('../controller/episodeController');
  var postsList = require('../controller/postController');
  var playersList = require('../controller/playerController');
  var emails = require('../controller/emailController');

  // characters routes
  app.route('/api/characters')
    .post(characterList.add_character)
    .get(characterList.get_characters);
  app.route('/api/characters/:id')
    .post(characterList.update_character)
    .get(characterList.get_character); 
  app.route('/api/characters/:id/episodes')
    .get(characterList.get_character_episodes);    
 
  // episodes routes
  app.route('/api/episodes')
    .post(episodesList.create_an_episode)
    .get(episodesList.list_episodes);
  app.route('/api/latest')
    .get(episodesList.list_latest);  
  app.route('/api/episodes/:episodeId')
    .get(episodesList.read_episode)
    .post(episodesList.update_episode);
  app.route('/api/episodes/:episodeId/branches')
    .get(episodesList.get_branches)
    .post(episodesList.update_branches);
  app.route('/api/episodes/:episodeId/close')
    .post(episodesList.close_episode);  
  app.route('/api/episodes/:episodeId/reopen')
    .post(episodesList.reopen_episode);    
  app.route('/api/branches')
    .get(episodesList.branches);    
  app.route('/api/addBranch/:branch')
    .post(episodesList.add_branch);   
    
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
  app.route('/api/posts/:postId/comments')
    .post(postsList.add_comment)
    .get(postsList.list_comments_by_post_id);  
    
  //player routes
  app.route('/api/players/:playerId/characters')
  	.get(characterList.list_characters); 
  app.route('/api/players')
    .get(playersList.get_player)
    .post(playersList.add_player);		
  app.route('/api/players/:playerId/episodes')
  	.get(playersList.get_episodes);
  app.route('/api/players/:playerId/comments')
  	.get(playersList.get_comments);	 
  app.route('/api/players/:playerId/feedback')
  	.get(playersList.get_feedback);		
  app.route('/api/debts')
    .get(playersList.get_debts);
    
  app.route('/api/sendEmailPost')
    .post(emails.send_post_notification);  
  app.route('/api/setupSubscription')  
    .post(emails.setup_subscription);
  app.route('/api/checkSubscription')  
    .post(emails.check_subscription);  
  app.route('/api/deleteSubscription')  
    .post(emails.delete_subscription);  
};  
    