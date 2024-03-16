'use strict';

var Topic = require('../model/topicModel.js');
var Reply = require('../model/replyModel.js');

exports.create_a_topic = function(req, res) {
  var new_topic = new Topic(req.body);

  //handles null error 
   if ( !new_topic.name || !new_topic.status_id || !new_topic.author_id ) {
            res.status(400).send({ error:true, message: 'Please provide name, status and author' });
        }
else { 
  		Topic.createTopic(new_topic, function(err, topic) {    
    	if (err)
      		res.send(err);	
    	res.json(topic);
  	});
  };
};

exports.list_topics = function(req, res) {
  var status = 0;
  if (req.query.status) status = req.query.status;
  Topic.listTopics(status, function(err, response) {
    if (err)
      res.send(err);  
    res.json(response);
  });
};

exports.close_topic = function(req, res) {
  Topic.setTopicStatus(req.params.topicId, 2, function(err, response) {
    if (err)
      res.send(err);  
    res.json(response);
  });
}

exports.reopen_topic = function(req, res) {
  Topic.setTopicStatus(req.params.topicId, 1, function(err, response) {
    if (err)
      res.send(err);  
    res.json(response);
  });
}

exports.update_topic = function(req, res) {
  var updated_topic = new Topic(req.body);

  //handles null error 
   if ( !updated_topic.name) {
            res.status(400).send({ error:true, message: 'Please provide name' });
        }
else { 
  		Topic.updateTopic(parseInt(req.params.topicId), updated_topic, function(err, topic) {    
    	if (err)
      		res.send(err);	
    	res.json(topic);
  	});
  };
};

exports.get_replies = function(req, res) {
  Topic.getReplies(req.params.topicId, function(err, response) {
    if (err)
      res.send(err);
    res.json(response);
  });
};

exports.add_reply = function(req, res) {
  var new_reply = new Reply(req.body);

  //handles null error 
   if ( !new_reply.body || !new_reply.author_id || !new_reply.topic_id) {
            res.status(400).send({ error:true, message: 'Please provide topic, body and author' });
        }
   else { 
  		Topic.addReply(new_reply, function(err, response) {    
    	if (err)
      		res.send(err);	
    	res.json(response);
  	});
  };
};