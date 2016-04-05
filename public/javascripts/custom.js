/* 
 * The following jQuery function gets called when the HTML DOM is ready to be inspected and manipulated
 * by javascript.
 */
$(document).ready(function(){
   /*
    * The following is a click event listener for the button element with the id button-one
    */
    
    // Create a socket object. This will create a connection between this client and the server from 
    // which this javascript code was downloaded from.
    var socket = io();
    
    // jQuery code to catch the form submit
    $('form[name="chat"]').submit(function(){
      console.log("Sending a message")
      
      // Get the contents of the html element that has the is message (i.e. the form input field in
      // this example) and use it as the message component of the event 'chat message' that you emit
      // to the server.
      socket.emit('chat message', $('#message').val());
      
      // Clear the contents of the input field
      $('#message').val('');
      
      // return false so that the browser will take no more action i.e. it won't try and send a http
      // resquest to the url specified in the action field of the form.
      return false;
    });
    
    $('form[name="login"]').submit(function(){
       socket.emit('login', $('#username').val());
       return false; 
    });

    // When I receive a 'chat message' event ...
    socket.on('chat message', function(data){
      console.log("Received a message");
      
      // Append the contents of the message received from the server to the li's
      $('#messages').prepend($('<li>').text(data.user + " : " + data.msg));
    });
    
    // When I receive a login message from the server (in response to me emitting a
    // login event to the server)
    socket.on('login', function(msg){
       console.log("on.login");
       // Hide the loginPage
       $('.loginPage').hide();
       // Show the chatPage
       $('.chatPage').show();
       $('#message').focus();
       
       $('#messages').append($('<li>').text("Welcome. There are " + msg.numClients + " people online"));
    });
    
    socket.on('user joined', function(msg){
      if ($('.chatPage').is(':visible')) {
        $('#messages').prepend($('<li>').text(msg.username + " just joined."));
      }
    });

});