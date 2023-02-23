'use strict';

var Post = require('../model/postModel.js');

exports.add_post = function(req, res) {
  var new_post = new Post(req.body);

  //handles null error 
   if ( !new_post.body || !new_post.author_id || !new_post.episode_id) {
            res.status(400).send({ error:true, message: 'Please provide episode, body and author' });
        }
   else { 
  		Post.createPost(new_post, function(err, post) {    
    	if (err)
      		res.send(err);	
    	res.json(post);
  	});
  };
};

exports.list_posts_by_episode_id = function(req, res) {
  Post.listPostsByEpisodeId(req.params.episodeId, function(err, posts) {
    if (err)
      res.send(err);
    res.json(posts);
  });
};

exports.view_post = function(req, res) {
  Post.getPost(req.params.postId, function(err, post) {
    if (err)
      res.send(err);  
    res.json(post);
  });
}

exports.update_post = function(req, res) {
  var post = new Post(req.body);

  //handles null error 
   if ( !post.body) {
            res.status(400).send({ error:true, message: 'Please provide body' });
        }
else { 
  		Post.updatePost(parseInt(req.params.postId), post, function(err, post_response) {    
    	if (err)
      		res.send(err);	
    	res.json(post_response);
  	});
  };
};