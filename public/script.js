//Connect socket
var socket = io();

//Handle events from server
socket.on('init', handleInit);
socket.on('gameCode', handleGameCode);
socket.on('unknownCode', handleUnknownCode);
socket.on('tooManyPlayers', handleTooManyPlayers);
socket.on('needMorePlayers', handleNeedMorePlayers);
socket.on('displayNames', handleDisplayNames);
socket.on('readyGame', handleReadyGame);
socket.on('handleLine', Handler);
socket.on('turnHandle', clickLines);

//Get elements from html
const lobbyScreen = document.getElementById('lobbyScreen');
const initialScreen = document.getElementById('initialScreen');
const mainScreen = document.getElementById('mainScreen');
const newGameBtn = document.getElementById('createGame');
const joinGameBtn = document.getElementById('joinGame');
const clearBtn = document.getElementById('restart');
const gameCodeInput = document.getElementById('gameCodeIn');
const gameCodeDisplay = document.getElementById('gameCodeDisplay');
const nameInput = document.getElementById('nameIn');
const nameInput2 = document.getElementById('nameIn2');
const nameP1 = document.getElementById('p1Score');
const nameP2 = document.getElementById('p2Score');
const nameP3 = document.getElementById('p3Score');
const readyBtn = document.getElementById('ready');
const nameDisplayP1 = document.getElementById('player1Score');
const nameDisplayP2 = document.getElementById('player2Score');
const nameDisplayP3 = document.getElementById('player3Score');
const scoreP1 = document.getElementById("scoreP1"); 
const scoreP2 = document.getElementById("scoreP2"); 
const scoreP3 = document.getElementById("scoreP3"); 

//Declare some global variables
var roomCode;
let playerNumber;
let p1Name = "";
let p2Name = "";
let p3Name = "";

//Listen to button clicks
newGameBtn.addEventListener('click', newGame);
joinGameBtn.addEventListener('click', joinGame);
readyBtn.addEventListener('click', readyGame);
clearBtn.addEventListener('click', clear);

//Start new room
function newGame() {
    reset();
    if(nameInput.value == "") {
        reset();
        alert('Input Name')
    }
    else {
        socket.emit('newGame', nameInput.value);
        readyBtn.style.visibility = "visible";
        init();
    }
}

//Connect user to entered room
function joinGame() {
    if(nameInput2.value == "" || gameCodeInput.value == "") {
        reset();
        alert('Input Name and Game Code')
    }
    else {
        const code = gameCodeInput.value;
        socket.emit('joinGame', code, nameInput2.value);
        init();
    }
}

//Tells server to start game
function readyGame() {
    socket.emit('ready', roomCode);
}

//Alert host if less than 3 players are in lobby
function handleNeedMorePlayers() {
    alert('Need 3 Players to Start Game')
}

//Sets up the game screen
function handleReadyGame(name1, name2, name3) {
    initialScreen.style.display = "none";
    lobbyScreen.style.display = "none";
    mainScreen.style.display = "flex";
    nameDisplayP1.innerText = name1;
    nameDisplayP2.innerText = name2;
    nameDisplayP3.innerText = name3;
}

//Show lobby screen
function init() {
    initialScreen.style.display = "none";
    mainScreen.style.display = "none";
    lobbyScreen.style.display = "flex";
}

//Assign numbers to player and log them
function handleInit(number) {
    playerNumber = number;
    console.log("player number: " + playerNumber)
}

//Show player names
function handleDisplayNames(dispP1, dispP2, dispP3) {
    p1Name = dispP1;
    nameP1.innerText = dispP1;

    p2Name = dispP2;
    nameP2.innerText = dispP2;

    p3Name = dispP3;
    nameP3.innerText = dispP3;
}

//Show gamecode
function handleGameCode(gameCode) {
    roomCode = gameCode;
    gameCodeDisplay.innerText = gameCode;
}

//Alert if room does not exist
function handleUnknownCode() {
    reset();
    alert('Unknown Game Code')
}

//Alert if lobby is full on attempt to connect
function handleTooManyPlayers() {
    reset();
    alert('This game lobby is full');
}

//Reset to home screen
function reset() {
    playerNumber = null;
    gameCodeInput.value = '';
    lobbyScreen.style.display = "none";
    initialScreen.style.display = "flex";
}

//Clear all values and sockets from room after game is over
function clear() {
    playerNumber = null;
    gameCodeInput.value = '';
    lobbyScreen.style.display = "none";
    initialScreen.style.display = "flex";
    socket.emit('clearRoom', roomCode);
}

//Declaring each dot clicked as false
let Circle11 = false;
let Circle12 = false;
let Circle13 = false;
let Circle14 = false;
let Circle21 = false;
let Circle22 = false;
let Circle23 = false;
let Circle24 = false;
let Circle31 = false;
let Circle32 = false;
let Circle33 = false;
let Circle34 = false;
let Circle41 = false;
let Circle42 = false;
let Circle43 = false;
let Circle44 = false;

//Declaring each box as false
let square1 = false;
let square2 = false;
let square3 = false;
let square4 = false;
let square5 = false;
let square6 = false;
let square7 = false;
let square8 = false;
let square9 = false;

//Initialize the score and all empty boxes
var boxes = [square1, square2, square3, square4, square5, square6, square7, square8, square9];
var turn = 0;
var red = 0;
var green = 0;
var yellow = 0;

//Get all horizontal lines from page
var line11 = document.getElementById("line11");
var line12 = document.getElementById("line12");
var line13 = document.getElementById("line13");
var line21 = document.getElementById("line21");
var line22 = document.getElementById("line22");
var line23 = document.getElementById("line23");
var line31 = document.getElementById("line31");
var line32 = document.getElementById("line32");
var line33 = document.getElementById("line33");
var line41 = document.getElementById("line41");
var line42 = document.getElementById("line42");
var line43 = document.getElementById("line43");

//Get all vertical lines from page
var vline11 = document.getElementById("vline11");
var vline12 = document.getElementById("vline12");
var vline13 = document.getElementById("vline13");
var vline14 = document.getElementById("vline14");
var vline21 = document.getElementById("vline21");
var vline22 = document.getElementById("vline22");
var vline23 = document.getElementById("vline23");
var vline24 = document.getElementById("vline24");
var vline31 = document.getElementById("vline31");
var vline32 = document.getElementById("vline32");
var vline33 = document.getElementById("vline33");
var vline34 = document.getElementById("vline34");


//Update scores for all users
function Check(turn) {
    if(square1 == false){
        if(line11.style.visibility == "visible" && line21.style.visibility == "visible" && vline11.style.visibility == "visible" && vline12.style.visibility == "visible") {
            boxes[0] = true;
            square1 = true;
        }
    }
    if(square2 == false){
        if(line12.style.visibility == "visible" && line22.style.visibility == "visible" && vline12.style.visibility == "visible" && vline13.style.visibility == "visible") {
            boxes[1] = true;
            square2 = true;
        }
    }
    if(square3 == false){
        if(line13.style.visibility == "visible" && line23.style.visibility == "visible" && vline13.style.visibility == "visible" && vline14.style.visibility == "visible") {
            boxes[2] = true;
            square3 = true;
        }
    }
    if(square4 == false){
        if(line21.style.visibility == "visible" && line31.style.visibility == "visible" && vline21.style.visibility == "visible" && vline22.style.visibility == "visible") {
            boxes[3] = true;
            square4 = true;
        }
    }
    if(square5 == false){
        if(line22.style.visibility == "visible" && line32.style.visibility == "visible" && vline22.style.visibility == "visible" && vline23.style.visibility == "visible") {
            boxes[4] = true;
            square5 = true;
        }
    }
    if(square6 == false){
        if(line23.style.visibility == "visible" && line33.style.visibility == "visible" && vline23.style.visibility == "visible" && vline24.style.visibility == "visible") {
            boxes[5] = true;
            square6 = true;
        }
    }
    if(square7 == false){
        if(line31.style.visibility == "visible" && line41.style.visibility == "visible" && vline31.style.visibility == "visible" && vline32.style.visibility == "visible") {
            boxes[6] = true;
            square7 = true;
        }
    }
    if(square8 == false){
        if(line32.style.visibility == "visible" && line42.style.visibility == "visible" && vline32.style.visibility == "visible" && vline33.style.visibility == "visible") {
            boxes[7] = true;
            square8 = true;
        }
    }
    if(square9 == false){
        if(line33.style.visibility == "visible" && line43.style.visibility == "visible" && vline33.style.visibility == "visible" && vline34.style.visibility == "visible") {
            boxes[8] = true;
            square9 = true;
        }
    }

    for (let i = 0; i < boxes.length; i++) {
        if(boxes[i] === true){
            delete boxes[i];
            if(turn == 0){
                red += 1;
                window.turn -= 1;
                scoreP1.innerHTML = "Score: " + red;
            }
            else if(turn == 1){
                green += 1;
                window.turn -= 1;
                scoreP2.innerHTML = "Score: " + green;
            }
            else if(turn == 2){
                yellow += 1;
                window.turn += 2;
                scoreP3.innerHTML = "Score: " + yellow;
            }
        }
    }
}

//Make the lines visible to all and show game end screen if the game is done
function Handler(line, roomName){
    var temp = document.getElementById(line);
    if(temp.style.visibility == "visible"){
        return;
    }
    if(turn == 0){
        temp.style.backgroundColor = "red";
        temp.style.visibility = "visible";
        Check(turn);
        turn +=1;
    }
    else if(turn == 1){
        temp.style.backgroundColor = "green";
        temp.style.visibility = "visible";
        Check(turn);
        turn +=1;
    }
    else if(turn == 2){
        temp.style.backgroundColor = "orange";
        temp.style.visibility = "visible";
        Check(turn);
        turn -= 2;
    }
    if(square1 == true && square2 == true && square3 == true && square4 == true && square5 == true && square6 == true && square7 == true && square8 == true && square9 == true){
        var first = document.getElementById("first");
        var second = document.getElementById("second");
        var third = document.getElementById("third");
        document.getElementById("gameboard").style.display = "none";
        document.getElementById("win").style.display = "flex";

        if(Math.max(red, green, yellow) == red){
            console.log("test1");
            first.innerHTML = "1st) " + p1Name + " - " + red;
            if(Math.max(green, yellow) == green){
                second.innerHTML = "2nd) " + p2Name + " - " + green;
                third.innerHTML = "3rd) " + p3Name + " - " + yellow;
            }
            else{
                second.innerHTML = "2nd) " + p3Name + " - " + yellow;
                third.innerHTML = "3rd) " + p2Name + " - " + green;
            }
        }
        else if(Math.max(red, green, yellow) == green){
            first.innerHTML = "1st) " + p2Name + " - " + green;
            if(Math.max(red, yellow) == red){
                second.innerHTML = "2nd) " + p1Name + " - " + red;
                third.innerHTML = "3rd) " + p3Name + " - " + yellow;
            }
            else{
                second.innerHTML = "2nd) " + p3Name + " - " + yellow;
                third.innerHTML = "3rd) " + p1Name + " - " + red;
            }
        }
        else{
            first.innerHTML = "1st) " + p3Name + " - " + yellow;
            if(Math.max(green, red) == green){
                second.innerHTML = "2nd) " + p2Name + " - " + green;
                third.innerHTML = "3rd) " + p1Name + " - " + red;
            }
            else{
                second.innerHTML = "2nd) " + p1Name + " - " + red;
                third.innerHTML = "3rd) " + p2Name + " - " + green;
            }
        }
    }
    socket.emit('handleTurn', turn, roomName);
}

//If user clicks on dots to make line then send to server
function clickLines() {
    if(document.getElementById("circle11")) {
    
        document.getElementById("circle11").addEventListener('click',()=>{
            Circle11 = true
            if(Circle11 && Circle12) {Circle11 = false; Circle12 = false; socket.emit('lineHandler', "line11", roomCode);}
            else if(Circle11 && Circle21) {Circle11 = false; Circle21 = false; socket.emit('lineHandler', "vline11", roomCode);}
        })
    
        document.getElementById("circle12").addEventListener('click',()=>{
            Circle12 = true
            if(Circle12 && Circle11) {Circle11 = false; Circle12 = false; socket.emit('lineHandler', "line11", roomCode);}
            else if(Circle12 && Circle13) {Circle12 = false; Circle13 = false; socket.emit('lineHandler', "line12", roomCode);}
            else if(Circle12 && Circle22) {Circle12 = false; Circle22 = false; socket.emit('lineHandler', "vline12", roomCode);}
        })
    
        document.getElementById("circle13").addEventListener('click',()=>{
            Circle13 = true
            if(Circle13 && Circle12) {Circle12 = false; Circle13 = false; socket.emit('lineHandler', "line12", roomCode);}
            else if(Circle13 && Circle14) {Circle13 = false; Circle14 = false; socket.emit('lineHandler', "line13", roomCode);}
            else if(Circle13 && Circle23) {Circle13 = false; Circle23 = false; socket.emit('lineHandler', "vline13", roomCode);}
        })
    
        document.getElementById("circle14").addEventListener('click',()=>{
            Circle14 = true
            if(Circle14 && Circle13) {Circle13 = false; Circle14 = false; socket.emit('lineHandler', "line13", roomCode);}
            else if(Circle14 && Circle24) {Circle14 = false; Circle24 = false; socket.emit('lineHandler', "vline14", roomCode);}
        })
    
        document.getElementById("circle21").addEventListener('click',()=>{
            Circle21 = true
            if(Circle21 && Circle22) {Circle21 = false; Circle22 = false; socket.emit('lineHandler', "line21", roomCode);}
            else if(Circle11 && Circle21) {Circle11 = false; Circle21 = false; socket.emit('lineHandler', "vline11", roomCode);}
            else if(Circle31 && Circle21) {Circle31 = false; Circle21 = false; socket.emit('lineHandler', "vline21", roomCode);}
        })
    
        document.getElementById("circle22").addEventListener('click',()=>{
            Circle22 = true
            if(Circle22 && Circle21) {Circle21 = false; Circle22 = false; socket.emit('lineHandler', "line21", roomCode);}
            else if(Circle22 && Circle23) {Circle23 = false; Circle22 = false; socket.emit('lineHandler', "line22", roomCode);}
            else if(Circle12 && Circle22) {Circle12 = false; Circle22 = false; socket.emit('lineHandler', "vline12", roomCode);}
            else if(Circle32 && Circle22) {Circle32 = false; Circle22 = false; socket.emit('lineHandler', "vline22", roomCode);}
        })
    
        document.getElementById("circle23").addEventListener('click',()=>{
            Circle23 = true
            if(Circle23 && Circle22) {Circle23 = false; Circle22 = false; socket.emit('lineHandler', "line22", roomCode);}
            else if(Circle23 && Circle24) {Circle23 = false; Circle24 = false; socket.emit('lineHandler', "line23", roomCode);}
            else if(Circle13 && Circle23) {Circle13 = false; Circle23 = false; socket.emit('lineHandler', "vline13", roomCode);}
            else if(Circle33 && Circle23) {Circle33 = false; Circle23 = false; socket.emit('lineHandler', "vline23", roomCode);}
        })
    
        document.getElementById("circle24").addEventListener('click',()=>{
            Circle24 = true
            if(Circle24 && Circle23) {Circle23 = false; Circle24 = false; socket.emit('lineHandler', "line23", roomCode);}
            else if(Circle14 && Circle24) {Circle14 = false; Circle24 = false; socket.emit('lineHandler', "vline14", roomCode);}
            else if(Circle34 && Circle24) {Circle34 = false; Circle24 = false; socket.emit('lineHandler', "vline24", roomCode);}
        })
    
        document.getElementById("circle31").addEventListener('click',()=>{
            Circle31 = true
            if(Circle31 && Circle32) {Circle31 = false; Circle32 = false; socket.emit('lineHandler', "line31", roomCode);}
            else if(Circle31 && Circle21) {Circle31 = false; Circle21 = false; socket.emit('lineHandler', "vline21", roomCode);}
            else if(Circle31 && Circle41) {Circle31 = false; Circle41 = false; socket.emit('lineHandler', "vline31", roomCode);}
        })
    
        document.getElementById("circle32").addEventListener('click',()=>{
            Circle32 = true
            if(Circle32 && Circle31) {Circle31 = false; Circle32 = false; socket.emit('lineHandler', "line31", roomCode);}
            else if(Circle32 && Circle33) {Circle33 = false; Circle32 = false; socket.emit('lineHandler', "line32", roomCode);}
            else if(Circle32 && Circle22) {Circle32 = false; Circle22 = false; socket.emit('lineHandler', "vline22", roomCode);}
            else if(Circle32 && Circle42) {Circle32 = false; Circle42 = false; socket.emit('lineHandler', "vline32", roomCode);}
        })
    
        document.getElementById("circle33").addEventListener('click',()=>{
            Circle33 = true
            if(Circle33 && Circle32) {Circle33 = false; Circle32 = false; socket.emit('lineHandler', "line32", roomCode);}
            else if(Circle33 && Circle34) {Circle33 = false; Circle34 = false; socket.emit('lineHandler', "line33", roomCode);}
            else if(Circle33 && Circle23) {Circle33 = false; Circle23 = false; socket.emit('lineHandler', "vline23", roomCode);}
            else if(Circle33 && Circle43) {Circle33 = false; Circle43 = false; socket.emit('lineHandler', "vline33", roomCode);}
        })
    
        document.getElementById("circle34").addEventListener('click',()=>{
            Circle34 = true
            if(Circle34 && Circle33) {Circle33 = false; Circle34 = false; socket.emit('lineHandler', "line33"), roomCode;}
            else if(Circle34 && Circle24) {Circle34 = false; Circle24 = false; socket.emit('lineHandler', "vline24", roomCode);}
            else if(Circle34 && Circle44) {Circle34 = false; Circle44 = false; socket.emit('lineHandler', "vline34", roomCode);}
        })
    
        document.getElementById("circle41").addEventListener('click',()=>{
            Circle41 = true
            if(Circle41 && Circle42) {Circle41 = false; Circle42 = false; socket.emit('lineHandler', "line41", roomCode);}
            else if(Circle31 && Circle41) {Circle31 = false; Circle41 = false; socket.emit('lineHandler', "vline31", roomCode);}
        })
    
        document.getElementById("circle42").addEventListener('click',()=>{
            Circle42 = true
            if(Circle42 && Circle41) {Circle41 = false; Circle42 = false; socket.emit('lineHandler', "line41", roomCode);}
            else if(Circle42 && Circle43) {Circle43 = false; Circle42 = false; socket.emit('lineHandler', "line42", roomCode);}
            else if(Circle32 && Circle42) {Circle32 = false; Circle42 = false; socket.emit('lineHandler', "vline32", roomCode);}
        })
    
        document.getElementById("circle43").addEventListener('click',()=>{
            Circle43 = true
            if(Circle43 && Circle42) {Circle43 = false; Circle42 = false; socket.emit('lineHandler', "line42", roomCode);}
            else if(Circle43 && Circle44) {Circle43 = false; Circle44 = false; socket.emit('lineHandler', "line43", roomCode);}
            else if(Circle33 && Circle43) {Circle33 = false; Circle43 = false; socket.emit('lineHandler', "vline33", roomCode);}
        })
    
        document.getElementById("circle44").addEventListener('click',()=>{
            Circle44 = true
            if(Circle44 && Circle43) {Circle43 = false; Circle44 = false; socket.emit('lineHandler', "line43", roomCode);}
            else if(Circle34 && Circle44) {Circle34 = false; Circle44 = false; socket.emit('lineHandler', "vline34", roomCode);}
        })
    }
}