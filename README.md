# Pictionary App with Socket.IO #

Pictionary game made with Socket.IO and Express. You can try it out here : https://pictionary.ashwinbose6.repl.co/ (run it from here if it doesn't work https://repl.it/@ashwinbose6/pictionary#index.js)

## What is pictionary? ##

Pictionary is a game which involves a drawer and guessers. The drawer is given a word and has to draw that word. For example, if the word was "ball" the draw would have to draw a ball. The guessers have to guess what the drawer is drawing.

This is a project which lets you play pictionary on the browser. Players can join different games from anywhere all thanks to Socket.IO! 

## Installing Socket.IO and Express ##

In order for this to work, you need Node.js, Socket.IO and Express

If you have Node.js already installed, you can use npm to install Socket.IO and Express

```
npm install socket.io
npm install express
```

Socket.IO also requires you to have the client-side library which you can include in your html file using script tags

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js"></script>
```

## What is Socket.IO ##

Socket.IO is a JS library which allows for realtime, bi-directional communication between web-clients and servers. It has a client-side library and a server side library. 

You can find more about it here : https://socket.io/

It comes in handy when you want to create anything which involves realtime updates such as a chat application or a shared drawing screen (both of which are included in this project)

## Simple example with Socket.IO ##

First, let's set up our folder structure

```
server.js
public
  index.html
```

server.js
```js
const express = require('express')
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http); // creating a new instance of socket.io by passing it the http server

app.use(express.static(__dirname + "/public"))

io.on('connection', function (socket) {
  //This function is called whenever we get a new socket.io connection
  socket.on("message", function(msg) {
    // This function is called whenever we receive a "message" event
    io.emit("message", msg) // Sends out "message" event to all connected clients
  })
});

http.listen(3000, () => {
  console.log('listening on port 3000');
});
```

index.html
```html
<input id="msg"></input>
<button id="send">Send!</button>

<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js"></script>
<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
<script>
  $(document).ready(function() {
    var socket = io() // establishes a new connection with the server
    $("#send").click(function() {
      socket.emit("message", $("#msg").val()) // emits "message" event
    })
  
    socket.on("message", function(msg) {
      // Function is called when we receive "message" event
      $("body").append("<br>"+msg) // shows message
    })
  })
</script>
```

Now if you run ```node server.js``` in your terminal and open two localhost:3000 tabs in your browser, you should be able to messages and see them come up on both tabs!

As you can see, communicating with Socket.IO is based around emitting and receiving events. 

In this example, everyone who is connected can see everyone's messages. But what if you want to have the message sent to certain connected clients? That is when you would utilise **rooms**. With rooms, clients can join a certain room and events can be sent to specific rooms rather than to every connected client. More can be found about rooms here : https://socket.io/docs/rooms/#Default-room

## How is it used in the project ##

The chat function in the project has been implemented very similarly to how it is done in the example.

For sharing the drawing across different screens, an event is sent out every time the drawer has let go the mouse. An array is sent out during this eveny which represents the drawing that should be displayed on the screen. 

However, instead of sending the events to every connected client, the event is emitted to clients who are in the same **room** as the event emitter. This makes it possible to have multiple different games of pictionary! 

