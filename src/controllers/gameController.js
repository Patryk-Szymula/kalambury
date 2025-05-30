// KONTROLER GRY PO STRONIE SERWERA

class GameController {
    constructor() {
        this.callbacks = {};
        this.players = [];
        this.gameStarted = false;
        this.drawerIndex = 0;
        this.roundIndex = 1;
        this.maxRound = 10;
        this.roundTime = 20;
        this.roundTimer = null;
        this.currentAnswer = "hasło";
    };

    on(event, callback) {
        this.callbacks[event] = callback;
    }

    emit(event, data) {
        if (this.callbacks[event]) {
            this.callbacks[event](data);
        }
    }

    addPlayer(playerId, playerName) {
        const player = {
            id: playerId,
            name: playerName,
            points: 0,
            isHost: this.players.length == 0
        };
        this.players.push(player);
    }

    removePlayer(playerId) {
        let playerIndex = this.players.findIndex(e => e.id == playerId);
        let wasHost = this.players.find(e => e.id == playerId).isHost

        // Remove player
        this.players = this.players.filter(e => e.id != playerId);

        // Change host
        if (wasHost && this.players.length > 0)
            this.players[0].isHost = true;

        // Change drawer
        if (playerIndex < this.drawerIndex && this.gameStarted) {
            this.drawerIndex--;
        }
        // Change drawer and round if it was his turn
        else if (playerIndex == this.drawerIndex && this.gameStarted) {
            this.drawerIndex--;
            this.nextRound();
        }
    }

    startGame() {
        this.emit('startGame', {});
        this.gameStarted = true;
        this.drawerIndex = 0;
        this.roundIndex = 1;
        this.startRound();
    }

    startRound() {
        this.emit('startRound', { round: this.roundIndex, drawerName: this.players[this.drawerIndex].name, roundTime: this.roundTime });
        console.log(this.players)
        console.log(`Round: ${this.roundIndex}`)
        console.log(`Drawer: ${this.players[this.drawerIndex].name}`)
        console.log(`Answer: ${this.currentAnswer}`)

        let timeLeft = this.roundTime;
        this.roundTimer = setInterval(() => {
            timeLeft--;
            this.emit('timeUpdate', { timeLeft: timeLeft });

            if (timeLeft <= 0) {
                clearInterval(this.roundTimer);
                this.nextRound();
            }
        }, 1000);

    }

    nextRound() {
        this.roundIndex++;
        clearInterval(this.roundTimer);
        if (this.roundIndex <= this.maxRound) {
            this.drawerIndex = (this.drawerIndex + 1) % this.players.length;
            this.startRound();
        }
    }

    handleMessage(playerId, message) {
        console.log(`[message] ${playerId}: ${message}`);

        if (playerId == this.players[this.drawerIndex].id && message.toLowerCase() == this.currentAnswer.toLowerCase()) {
            message = "Nie wysyłaj hasła pozostałym graczom!";
            this.emit('drawerMessageWarning', { playerId: playerId, playerName: this.players.find(e => e.id == playerId).name, message: message });
        } else if (message.toLowerCase() == this.currentAnswer.toLowerCase()) {
            this.emit('chatMessage', { playerId: playerId, playerName: this.players.find(e => e.id == playerId).name, message: message });
            this.players.find(e => e.id == playerId).points += Math.min(Math.floor(this.roundTime / 5) + 1, 20);
            this.players.find(e => e.id == this.players[this.drawerIndex].id).points += 10;
            this.nextRound();
        } else {
            this.emit('chatMessage', { playerId: playerId, playerName: this.players.find(e => e.id == playerId).name, message: message });
        }
    }
}

module.exports = GameController;