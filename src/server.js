// GŁÓWNY PLIK SERWERA

const path = require("path");
const http = require("http");
const express = require('express');
const socketio = require('socket.io');
const GameController = require('./controllers/gameController');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));

// definicja zmiennych
let gameController = new GameController();
let users = [];

io.on('connect', (socket) => {
    console.log(`Socket connected, user ID: ${socket.id}`);
    users.push(socket.id)
    console.log("Active users:")
    console.log(users)

    socket.on('disconnect', () => {
        console.log(`Socket disconnected, user ID: ${socket.id}`);
        users.pop(socket.id);
        if (gameController.players.find(e => e.id == socket.id)) {
            gameController.removePlayer(socket.id);
            console.log("Player disconnected, players list:");
            console.log(gameController.players);
            gameController.players.forEach(player => {
                io.to(player.id).emit('playersUpdate', { players: gameController.players });
            });
        }
    });

    socket.on('join', (playerName) => {
        gameController.addPlayer(socket.id, playerName);
        console.log("Player joined, players list:");
        console.log(gameController.players);
        socket.emit('joinSuccess', { playerName: playerName, gameStarted: gameController.gameStarted });
        gameController.players.forEach(player => {
            io.to(player.id).emit('playersUpdate', { players: gameController.players });
        });
    });

    socket.on('startGame', () => {
        gameController.startGame();
    })
});

gameController.on('startGame', (data) => {
    gameController.players.forEach(player => {
        io.to(player.id).emit('startGame', data);
    });
});

gameController.on('startRound', (data) => {
    gameController.players.forEach(player => {
        io.to(player.id).emit('startRound', data);
    });
});

gameController.on('timeUpdate', (data) => {
    gameController.players.forEach(player => {
        io.to(player.id).emit('timeUpdate', data);
    });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Start serwera na porcie: ${port}`);
})