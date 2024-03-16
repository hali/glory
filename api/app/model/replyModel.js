'user strict';
var sql = require('./db.js');

var Reply = function(reply){
    this.id = reply.id;
    this.author_id = reply.author_id;
    this.body = reply.body;
    this.topic_id = reply.topic_id;
};

module.exports=Reply;