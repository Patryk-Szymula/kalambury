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
    }

    getId() {
        return this.socket.id;
    }

    join(playerName) {
        this.socket.emit('join', playerName);
    }

    start() {
        this.socket.emit('startGame');
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
}

export default Socket;