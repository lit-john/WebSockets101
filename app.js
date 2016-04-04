/*  
    This is an example of a "Web sockets" server built using Node.js. The idea is
    that you start this server and it waits for connections from clients.
    
    This code was initially generated with express-generator i.e. from the command 
    line I issued:
        > express my-app
        
    You should start looking at this example by first looking in bin/www which is
    where it all starts (this is because package.json specifies the 'start' script to
    be 'bin/www').
*/

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

/**
 * START OF WEB SOCKET CODE
 */

/**
 * First up I am going to define a function on the app object called onSocketConnection. I
 * have "wired" the server in bin/www to call this function when it receives a connect event.
 * Notice that this function is passed a socket parameter which is a web socket (you can think
 * of a socket as a communication pipe (connection) that gets created between the client and 
 * the server that both parties can use to communicate to eack other.)
 */

app.onSocketConnect = function(socket) {
  console.log("A user connected");
  
  // Remember in bin/www I stored the socket.io server up on the app under the name io. Now I
  // am retrieving the server as I need to use it.
  var io = app.get('io');

  // Add an event that will get called when we receive a 'chat message' event. I can make up 
  // these event names, I just need to make sure thet that client code uses the same names as
  // I do here. This will make a little more sense when we look at some client code. These are
  // known as custom events. Aside from the custom events we "make up", socket.io also emits
  // connect, message and disconnect events. We have already used the connect event in 
  // www/bin and we will use the other two soon.
  
  socket.on('chat message', function(msg){
    //socket.broadcast.emit('chat message', msg);
    // emit a 'chat message' event with the msg to all connected clients
    io.emit('chat message', msg);
  });
  
  // Add an event handler that will get called when we
  // receive a disconnect message
  socket.on('disconnect', function(){
    console.log("A user disconnected");
  });

  
}

/**
 * END OF WEB SOCKET CODE
 */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
