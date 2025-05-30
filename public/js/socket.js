// KOMUNIKACJA Z SERWEREM I GRACZAMI W CZASIE RZECZYWISTYM

class Socket {
    constructor() {
        this.socket = io();
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
    }

    getId() {
        return this.socket.id;
    }

    join(playerName) {
        this.socket.emit('join', playerName);
    }

    startGame() {
        this.socket.emit('startGame');
    }

    sendMessage(message) {
        this.socket.emit('sendMessage', message)
    }

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
}

export default Socket;