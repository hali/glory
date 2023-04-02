'use strict';
require('dotenv').config()
const Mailjet = require('node-mailjet');
var Email = require('../model/emailModel.js');


exports.send_post_notification = function(req, res) {

    const mailjet = Mailjet.apiConnect(
      process.env.MJ_APIKEY_PUBLIC,
      process.env.MJ_APIKEY_PRIVATE,
    );
    Email.getRecipients(req.body.episode_id, req.body.player_id, function(err, recipients) {
	  if (err)
		  res.send(err);  
		recipients.forEach(recipient => {
		  const request = mailjet
			.post('send', { version: 'v3.1' })
			.request({
			  Messages: [
				{
				  From: {
					Email: "admin@ageofglory.org",
					Name: "Age of Glory"
				  },
				  To: [
					{
					  Email: recipient.email,
					  Name: recipient.nickname
					}
				  ],
				  Subject: "Новый пост в теме " + req.body.thread_name,
				  TextPart: req.body.character_name + " написал пост!",
				  HTMLPart: "<h3>" + req.body.character_name + " написал пост: </h3><br>" + 
					req.body.post_text + "<br><br><a href=" + req.body.thread_url+ "><b>ПЕРЕЙТИ К ПОСТУ</b></a>"
				}
			  ]
			});

	request
		.then((result) => {
			res.json("{success: true}")
		})
		.catch((err) => {
			console.log(err.statusCode);
			res.json("{success: false}")
		});
		
		});
	  });  
};

exports.setup_subscription = function(req, res) {
  Email.addSubscription(req.body.episode_id, req.body.player_id, function(err, response) {
    if (err)
      res.send(err);  
    res.json(response);
  });
}

exports.delete_subscription = function(req, res) {
  Email.deleteSubscription(req.body.episode_id, req.body.player_id, function(err, response) {
    if (err)
      res.send(err);  
    res.json(response);
  });
}

exports.check_subscription = function(req, res) {
  Email.checkSubscription(req.body.episode_id, req.body.player_id, function(err, response) {
    if (err)
      res.send(err);  
    res.json(response);
  });
}