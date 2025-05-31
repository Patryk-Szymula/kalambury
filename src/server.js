// MAIN SERVER FILE

const path = require("path");
const http = require("http");
const express = require('express');
const socketio = require('socket.io');
const fs = require('fs');
const DatabaseController = require('./controllers/dbController');
const GameController = require('./controllers/gameController');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));

// Define variables
let dbController = new DatabaseController(fs);
let gameController = new GameController(dbController);
let users = []; // List for all users connected to app

// Handle client connection
io.on('connect', (socket) => {
    console.log(`Socket connected, user ID: ${socket.id}`);
    users.push(socket.id)
    console.log("Active users:")
    console.log(users)

    // Handle client disconnection
    socket.on('disconnect', () => {
        console.log(`Socket disconnected, user ID: ${socket.id}`);
        users.pop(socket.id);
        // Remove player from the game
        if (gameController.players.find(e => e.id == socket.id)) {
            gameController.removePlayer(socket.id);
            console.log("Player disconnected, players list:");
            console.log(gameController.players);
            // Update all players with the new players list
            gameController.players.forEach(player => {
                io.to(player.id).emit('playersUpdate', { players: gameController.players });
            });
        }
    });

    // Handle player joining the game
    socket.on('join', (playerName) => {
        gameController.addPlayer(socket.id, playerName);
        console.log("Player joined, players list:");
        console.log(gameController.players);
        // Notify the player of joining succesful
        socket.emit('joinSuccess', { playerName: playerName, gameStarted: gameController.gameStarted, drawHistory: gameController.drawHistory, roundInfo: {round: gameController.roundIndex, drawer: gameController.players[gameController.drawerIndex], roundTime: gameController.roundTime, currentAnswer: gameController.currentAnswer} });
        // Update all players with the new players list
        gameController.players.forEach(player => {
            io.to(player.id).emit('playersUpdate', { players: gameController.players });
        });
    });

    // Handle game start request from a client
    socket.on('startGame', () => {
        gameController.startGame();
    })

    // Handle chat message sent by a player
    socket.on('sendMessage', (message) => {
        gameController.handleMessage(socket.id, message);
    })

    // Handle draw sync
    socket.on('draw', (data) => {
        gameController.drawHistory.push(data);
        gameController.players.filter(e => e.id != gameController.players[gameController.drawerIndex].id).forEach(player => {
            io.to(player.id).emit('draw', data);
        });
    })
});

// Game controller callbacks handlers

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

gameController.on('chatMessage', (data) => {
    gameController.players.forEach(player => {
        io.to(player.id).emit('chatMessage', data);
    });
});

gameController.on('drawerMessageWarning', (data) => {
    io.to(data.playerId).emit('chatMessage', data);
});

// Set running server port
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Start serwera na porcie: ${port}`);
})