const path = require('path');

const express = require('express'),
  app = express(),
  bodyParser = require('body-parser');
  port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, './static')));

const mysql = require('mysql');
// connection configurations
const mc = mysql.createConnection({
    host: '34.77.35.228',
//    socketPath: '/cloudsql/trpg-buddy:europe-west1:mydb',
    user: 'apiUser',
    password: 'thecity',
    database: 'prod2'
});
 
// connect to database
mc.connect();

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, './static/index.html'));
});

app.listen(port);
const nocache = require('nocache');
app.use(nocache());
app.set("etag", false);

console.log('API server started on: ' + port);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.post('/post-test', (req, res) => {
    console.log('Got body:', req.body);
    res.sendStatus(200);
});
var routes = require('./app/routes/appRoutes.js'); //importing route
routes(app); //register the route
