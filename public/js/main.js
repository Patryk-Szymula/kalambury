// INICJALIZACJA GRY

import Socket from './socket.js';
import Game from './game.js';

document.addEventListener('DOMContentLoaded', () => {
    const socket = new Socket();
    const game = new Game(socket);

    game.init();

    window.addEventListener('beforeunload', () => {
        socket.disconnect();
    });
});