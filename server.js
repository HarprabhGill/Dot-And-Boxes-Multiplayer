const express = require('express')
const path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const state = {};
const socketRooms = {};

let p1Name = "";
let p2Name = "";
let p3Name = "";
let gCode = "";

io.on('connection', function(socket){
    console.log('User connected:' + socket.id);

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('newGame', handleNewGame);
    socket.on('joinGame', handleJoinGame);
    socket.on('ready', handleReadyGame)

    function handleNewGame(playerName) {
        console.log("new game")
    
        let roomName = makeid(5);
        socketRooms[socket.id] = roomName;
        socket.emit('gameCode', roomName);
        gCode = roomName;
        
        socket.join(roomName);
        socket.number = 1;
        io.sockets.to(roomName).emit('init', 1);
        p1Name = playerName;
        io.sockets.to(roomName).emit('displayNames', p1Name, "");
    }

    function handleJoinGame(roomName, playerName) {
      /*
      if (io.sockets.adapter.rooms.has(roomName)) {
        const allUsers = io.sockets.adapter.rooms[roomName].sockets;
        numSockets = Object.keys(allUsers).length;
      } 
      */
      const room = io.sockets.adapter.rooms[roomName];

      let allUsers; 
      if (room) {
          console.log("test")
          allUsers = room.sockets;
      }

      /*
      let numSockets = 0;
      if (allUsers) {
          console.log("test 2")
          numSockets = Object.keys(allUsers).length;
      }

      if (numSockets === 0) {
          socket.emit('unknownCode');
          return;
      } else if (numSockets > 2) {
          socket.emit('tooManyPlayers');
          return;
      }
      */

      socketRooms[socket.id] = roomName;
      socket.join(roomName);
      socket.emit('gameCode', roomName);
      socket.number = 2;
      io.sockets.to(roomName).emit('init', 2);
      p2Name = playerName;
      io.sockets.to(roomName).emit('displayNames', p1Name, p2Name);
    }

    function handleReadyGame() {
      io.sockets.to(gCode).emit('readyGame', p1Name, p2Name);
    }
});

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

server.listen(3000, () => {
  console.log('listening on *:3000');
});