// GŁÓWNY PLIK SERWERA

const path = require("path");
const http = require("http");
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);



const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
    console.log('Socket połączony, ID użytkownika: ' + socket.id);

    socket.on('disconnect', () => {
        console.log('Socket rozłączony, ID użytkownika: ', socket.id);
    });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Start serwera na porcie: ${port}`);
})