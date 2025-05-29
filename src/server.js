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
        if (users.includes(socket.id)) {
            console.log(`Socket disconnected, user ID: ${socket.id}`);
            gameController.removePlayer(socket.id);
            console.log(gameController);
            users.pop(socket.id);
        } else {
            console.log(`Unknown socket disconnected: ${socket.id}`);
        }
    });

    socket.on('join', (playerName) => {
        gameController.addPlayer(socket.id, playerName);
        console.log(gameController);
        socket.emit('joinSuccess', { playerName });
    })
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Start serwera na porcie: ${port}`);
})