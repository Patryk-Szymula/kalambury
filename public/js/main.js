// INICJALIZACJA GRY

import Socket from './socket.js';
import Game from './game.js';
import Chat from './chat.js';

document.addEventListener('DOMContentLoaded', () => {
    const socket = new Socket();
    const game = new Game(socket);
    const chat = new Chat(socket);

    game.init();
    chat.init();

    window.addEventListener('beforeunload', () => {
        socket.disconnect();
    });
});