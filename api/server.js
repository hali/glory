const path = require('path');
const config = require('./config');

const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  bearerToken = require('express-bearer-token');
  port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, './static')));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(bearerToken());

const mysql = require('mysql');
// connection configurations
const mc = mysql.createConnection(config.connection);
 
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

// Import and use authentication middleware
try {
  const authMiddleware = require('./app/middleware/authMiddleware');
  app.use(authMiddleware);
  console.log('Authentication middleware enabled');
} catch (error) {
  console.error('Failed to initialize authentication middleware:', error.message);
}

var routes = require('./app/routes/appRoutes.js'); //importing route
routes(app); //register the route
