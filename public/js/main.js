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
});