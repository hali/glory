'use strict';
require('dotenv').config()
const Mailjet = require('node-mailjet');
var Email = require('../model/emailModel.js');
const mailjet = Mailjet.apiConnect(
              process.env.MJ_APIKEY_PUBLIC,
              process.env.MJ_APIKEY_PRIVATE,
            );

function send_email(emails, threadName, characterName, postText, threadUrl) {
    let publicRecipient = [{Email: "admin@ageofglory.org", Name: "Dear subscriber"}];
    let bccRecipients = emails;
    if (emails.length === 1) {
        publicRecipient = emails;
        bccRecipients = [];
    }
        
	return mailjet
		.post('send', { version: 'v3.1' })
		.request({
			Messages: [{
				From: {
					Name: "Age of Glory",
					Email: "admin@ageofglory.org"
				},
				Bcc: bccRecipients,
				To: publicRecipient,
				HTMLPart: "<h3>" + characterName + " написал пост: </h3><br>" + 
                    postText + "<br><br><a href=" + threadUrl + "><b>ПЕРЕЙТИ К ПОСТУ</b></a>",
				Subject: "Новый пост в теме " + threadName,
				TextPart: characterName + " написал пост!",
			}]
		});
}

exports.send_post_notification = function(req, res) {
    Email.getRecipients(req.body.episode_id, req.body.player_id, function(err, recipients) {       
        send_email(recipients, req.body.thread_name, req.body.character_name, req.body.post_text, req.body.thread_url)
			.then(response => {
				res.json("{success: true}");
			})
			.catch(err => {
			    console.log(err);
			    res.send(err);
			}); 
    })
      
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