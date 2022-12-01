var socket = io();

socket.on('init', handleInit);
socket.on('gameCode', handleGameCode);
socket.on('unknownCode', handleUnknownCode);
socket.on('tooManyPlayers', handleTooManyPlayers);
socket.on('displayNames', handleDisplayNames);
socket.on('readyGame', handleReadyGame);

const lobbyScreen = document.getElementById('lobbyScreen');
const initialScreen = document.getElementById('initialScreen');
const mainScreen = document.getElementById('mainScreen');
const newGameBtn = document.getElementById('createGame');
const joinGameBtn = document.getElementById('joinGame');
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
//const scoreP1 = document.getElementById("scoreP1"); 


newGameBtn.addEventListener('click', newGame);
joinGameBtn.addEventListener('click', joinGame);
readyBtn.addEventListener('click', readyGame);

function newGame() {
    socket.emit('newGame', nameInput.value);
    readyBtn.style.visibility = "visible";
    init();
}

function joinGame() {
    const code = gameCodeInput.value;
    socket.emit('joinGame', code, nameInput2.value);
    init();
}

function readyGame() {
    console.log("rtest")
    socket.emit('ready');
}

function handleReadyGame(name1, name2) {
    initialScreen.style.display = "none";
    lobbyScreen.style.display = "none";
    mainScreen.style.display = "flex";
    gameActive = true;
    nameDisplayP1.innerText = name1;
    nameDisplayP2.innerText = name2;
}

let playerNumber;
let gameActive = false;

function init() {
    initialScreen.style.display = "none";
    mainScreen.style.display = "none";
    lobbyScreen.style.display = "flex";
    gameActive = true;
}

function handleInit(number) {
    playerNumber = number;
    console.log("player number: " + playerNumber)
}

let p1Name = "";
let p2Name = "";
let p3Name = "";

function handleDisplayNames(dispP1, dispP2) {
    p1Name = dispP1;
    nameP1.innerText = dispP1;

    p2Name = dispP2;
    nameP2.innerText = dispP2;
}

function handleGameCode(gameCode) {
    gameCodeDisplay.innerText = gameCode;
}

function handleUnknownCode() {
    reset();
    alert('Unknown Game Code')
}

function handleTooManyPlayers() {
    reset();
    alert('This game is already in progress');
}

function reset() {
    playerNumber = null;
    gameCodeInput.value = '';
    lobbyScreen.style.display = "none";
    initialScreen.style.display = "flex";
}