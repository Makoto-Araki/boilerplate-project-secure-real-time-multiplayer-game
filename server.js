require('dotenv').config();

// Module
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const expect = require('chai');
const socket = require('socket.io');
const cors = require('cors');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');

// Object
const app = express();
const server = http.Server(app);
const io = socket(server);

// Static
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/assets', express.static(process.cwd() + '/assets'));

// Parse
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//For FCC testing purposes and enables user to connect from outside the hosting platform
app.use(cors({origin: '*'})); 

// Index page (static HTML)
app
  .route('/')
  .get(function(req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  }); 

// Route I added
app.get('/:file', function(req, res) {
  res.sendFile(__dirname + '/public/' + req.params.file);
});

//For FCC testing purposes
fccTestingRoutes(app);
    
// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

// Global Data
let num = 0;
let gameData = [];

// User Connected socket.io server
io.on('connection', function(socket) {
  console.log('User Connected.');
  
  // User Data
  let userData = {
    ID: socket.id,
    X: 100 + 100 * num,
    Y: 100
  };
  
  // User Data push into Game Data
  gameData[num++] = userData;
  
  // Send 'join' message
  (function() {
    io.to(socket.id).emit('join', gameData);
  })();
  
});

// Port
const portNum = process.env.PORT || 3000;

// Set up server and tests
server.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

// For testing
module.exports = app;
