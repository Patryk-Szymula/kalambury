// COMMUNICATION WITH THE SERVER AND PLAYERS IN REAL TIME

class Socket {
    constructor() {
        this.socket = io();
        this.playerName = null;

        // Server listeners

        this.socket.on('connect', () => {
            console.log(`Logged, your ID: ${this.socket.id}`)
        });
        this.socket.on('disconnect', () => {
            console.log("Disconneced")
        })
        this.socket.on('joinSuccess', (data) => {
            if (this.onJoinSuccessCallback) {
                this.onJoinSuccessCallback(data);
            }
        });
        this.socket.on('playersUpdate', (data) => {
            if (this.onPlayersUpdateCallback) {
                this.onPlayersUpdateCallback(data);
            }
        });
        this.socket.on('startGame', (data) => {
            console.log("start")
            if (this.onGameStartCallback) {
                this.onGameStartCallback(data);
            }
        });
        this.socket.on('startRound', (data) => {
            if (this.onStartRoundCallback) {
                this.onStartRoundCallback(data);
            }
        });
        this.socket.on('timeUpdate', (data) => {
            if (this.onTimeUpdateCallback) {
                this.onTimeUpdateCallback(data);
            }
        });
        this.socket.on('chatMessage', (data) => {
            if (this.onChatMessageCallback) {
                this.onChatMessageCallback(data);
            }
        });
        this.socket.on('draw', (data) => {
            if (this.onDrawCallback) {
                this.onDrawCallback(data);
            }
        });
        this.socket.on('endGame', (data) => {
            if (this.onEndGameCallback) {
                this.onEndGameCallback(data);
            }
        });
    }

    // Returning client ID method
    getId() {
        return this.socket.id;
    }

    getPlayerName() {
        return this.playerName;
    }

    // Client emitters

    join(playerName) {
        this.playerName = playerName;
        this.socket.emit('join', playerName);
    }

    startGame() {
        this.socket.emit('startGame');
    }

    sendMessage(message) {
        this.socket.emit('sendMessage', message);
    }

    draw(data) {
        this.socket.emit('draw', data);
    }

    // Client callbacks

    onJoinSuccess(callback) {
        this.onJoinSuccessCallback = callback;
    }

    onPlayersUpdate(callback) {
        this.onPlayersUpdateCallback = callback;
    }

    onGameStart(callback) {
        this.onGameStartCallback = callback;
    }

    onStartRound(callback) {
        this.onStartRoundCallback = callback;
    }

    onTimeUpdate(callback) {
        this.onTimeUpdateCallback = callback;
    }

    onChatMessage(callback) {
        this.onChatMessageCallback = callback;
    }

    onDraw(callback) {
        this.onDrawCallback = callback;
    }

    onEndGame(callback) {
        this.onEndGameCallback = callback;
    }
}

export default Socket;