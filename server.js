//Create server
const express = require('express')
const path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

//Use files from public folder
app.use(express.static(path.join(__dirname, "public")))

//Start on index.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

//Declare some variables
var socketRooms = new Array ( );
let p1Name = "";
let p2Name = "";
let p3Name = "";

//On connection to server
io.on('connection', function(socket){

    //If user disconnects then log it
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    //If events recieved from client then go to function
    socket.on('newGame', handleNewGame);
    socket.on('joinGame', handleJoinGame);
    socket.on('ready', handleReadyGame);
    socket.on('lineHandler', handleLines);
    socket.on('clearRoom', handleClear);
    socket.on('handleTurn', handleTurn);

    //Create a new room and put host in it
    function handleNewGame(playerName) {
        console.log("new game")
    
        let roomName = makeid(5);
        socketRooms[roomName] = new Array ( socket.id, "", "" );

        socket.emit('gameCode', roomName);
        socket.join(roomName);
        socket.number = 1;
        io.sockets.to(roomName).emit('init', 1);
        p1Name = playerName;
        io.sockets.to(roomName).emit('displayNames', p1Name, "", "");
    }

    //Connect players 2 and 3 to room
    function handleJoinGame(roomName, playerName) {
      const clients = io.sockets.adapter.rooms.get(roomName);

      let numClients;
      if (clients) {
          numClients = clients ? clients.size : 0;
      }
      else{
          socket.emit('unknownCode');
          return;
      }

      if (numClients > 2) {
          socket.emit('tooManyPlayers');
          return;
      }

      socket.join(roomName);
      socket.emit('gameCode', roomName);

      if(numClients == 1) {
        socket.number = 2;
        socketRooms[roomName][1] = socket.id;
        io.sockets.to(roomName).emit('init', 2);
        p2Name = playerName;
        io.sockets.to(roomName).emit('displayNames', p1Name, p2Name, "");
      }
      else if(numClients == 2) {
        socket.number = 3;
        socketRooms[roomName][2] = socket.id;
        io.sockets.to(roomName).emit('init', 3);
        p3Name = playerName;
        io.sockets.to(roomName).emit('displayNames', p1Name, p2Name, p3Name);
      }
    }

    //Start game if there is 3 players
    function handleReadyGame(roomName) {
      const clients = io.sockets.adapter.rooms.get(roomName);
      let numClients = clients ? clients.size : 0;
      console.log(numClients)

      if (numClients == 3) {
        io.sockets.to(roomName).emit('readyGame', p1Name, p2Name, p3Name);
        handleTurn(0, roomName);
      }
      else{
          socket.emit('needMorePlayers');
          return;
      }
    }

    //Based on turn allow users to play
    function handleTurn(turn, roomName) {
      if(turn == 0){
        io.to(socketRooms[roomName][0]).emit('turnHandle');
      }
      else if(turn == 1){
        io.to(socketRooms[roomName][1]).emit('turnHandle');
      }
      else if(turn == 2){
        io.to(socketRooms[roomName][2]).emit('turnHandle');
      }
    }

    //Display lines to all users in room
    function handleLines(line, roomName) {
      io.sockets.to(roomName).emit('handleLine', line, roomName);
    }

    //Remove all users from room
    function handleClear(roomName) {
      io.in(roomName).socketsLeave(roomName);
    }
});

//Create random code for room
function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

//Listen for events on port 3000
server.listen(3000, () => {
  console.log('listening on *:3000');
});