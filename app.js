// imports
const express = require('express');
const errorHandler = require('errorhandler');
const path = require('path');
const dotenv = require('dotenv');
const chalk = require('chalk');
const compression = require('compression');
const bodyParser = require('body-parser');
const lusca = require('lusca');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const request = require('request');

dotenv.load({ path: '.env' });

// Create Express server
const app = express();

// Express configuration
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3001);
app.use(expressStatusMonitor());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});


app.get('/', (req, res) => {
  app.use('/img', express.static('img'));
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/main.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'main.css'));
});
app.get('/main.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'main.js'));
});
// request block for my twitch viewer tracker
app.get('/get_viewers', (req, res) => {
  if (req.query && req.query["username"].length > 0) {
    username = req.query["username"]
  }
  else {
    return;
  }
  response = request.get("https://tmi.twitch.tv/group/user/"+username+"/chatters", (er, resp, bod) => {
    let result;
    try {
      result = JSON.parse(bod);
    }
    catch(error) {
      return;
    }
    res.send(result);
  });
});




// Error Handler
app.use(errorHandler());

// Start Express server
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
