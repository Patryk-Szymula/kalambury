// GAME INITIALIZATION

import Socket from './socket.js';
import Game from './game.js';
import Chat from './chat.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initilizing objects
    const socket = new Socket();
    const game = new Game(socket);
    const chat = new Chat(socket);

    // Callling init methods
    game.init();
    chat.init();

    // Listening for a page to be closed or refreshed
    window.addEventListener('beforeunload', () => {
        socket.disconnect();
    });

    // Set up listeners for navigation menu buttons
    document.getElementById('gameButton').addEventListener('click', () => {
        document.getElementById('gameScreen').classList.replace("d-none", "d-flex");
        document.getElementById('leaderBoardScreen').classList.replace("d-flex", "d-none");
        document.getElementById('gameButton').classList.add("active");
        document.getElementById('leaderBoardButton').classList.remove("active");
    });
    document.getElementById('leaderBoardButton').addEventListener('click', () => {
        document.getElementById('gameScreen').classList.replace("d-flex", "d-none");
        document.getElementById('leaderBoardScreen').classList.replace("d-none", "d-flex");
        document.getElementById('gameButton').classList.remove("active");
        document.getElementById('leaderBoardButton').classList.add("active");
    });
});