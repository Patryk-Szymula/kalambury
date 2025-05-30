// GAME CONTROLLER ON SERVER

class GameController {
    constructor() {
        this.callbacks = {}; // Callbacks container
        this.players = []; // Players list
        this.gameStarted = false; // If game started flag
        this.drawerIndex = 0; // Current drawer index
        this.roundIndex = 1; // Current round index
        this.maxRound = 10; // Maximum round number
        this.roundTime = 20; // Remaining round time / Maximum round time
        this.roundTimer = null; // Round timer 
        this.currentAnswer = "hasło"; // Current word to guess
    };

    on(event, callback) {
        this.callbacks[event] = callback;
    }

    emit(event, data) {
        if (this.callbacks[event]) {
            this.callbacks[event](data);
        }
    }

    // Creating player object and adding to players list
    addPlayer(playerId, playerName) {
        const player = {
            id: playerId,
            name: playerName,
            points: 0,
            isHost: this.players.length == 0
        };
        this.players.push(player);
    }

    // Removing player
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

    // Starting game
    startGame() {
        this.emit('startGame', {});
        this.gameStarted = true;
        this.drawerIndex = 0;
        this.roundIndex = 1;
        this.startRound();
    }

    // Starting round
    startRound() {
        // Sending new round information to all players
        this.emit('startRound', { round: this.roundIndex, drawerName: this.players[this.drawerIndex].name, roundTime: this.roundTime });
        console.log(this.players)
        console.log(`Round: ${this.roundIndex}`)
        console.log(`Drawer: ${this.players[this.drawerIndex].name}`)
        console.log(`Answer: ${this.currentAnswer}`)

        // Round timer
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

    // Switching round
    nextRound() {
        this.roundIndex++;
        clearInterval(this.roundTimer);
        // Starting new round If the current round number is within the allowed limit
        if (this.roundIndex <= this.maxRound) {
            this.drawerIndex = (this.drawerIndex + 1) % this.players.length;
            this.startRound();
        }
    }

    // Read message from the player
    handleMessage(playerId, message) {
        console.log(`[message] ${playerId}: ${message}`);

        // Send warning for drawer if sending answer 
        if (playerId == this.players[this.drawerIndex].id && message.toLowerCase() == this.currentAnswer.toLowerCase()) {
            message = "Nie wysyłaj hasła pozostałym graczom!";
            this.emit('drawerMessageWarning', { playerId: playerId, playerName: this.players.find(e => e.id == playerId).name, message: message });
        }
        // Receiving correct answer
        else if (message.toLowerCase() == this.currentAnswer.toLowerCase()) {
            // Send message to all players 
            this.emit('chatMessage', { playerId: playerId, playerName: this.players.find(e => e.id == playerId).name, message: message });
            // Adding points for player who guessed correct answer
            this.players.find(e => e.id == playerId).points += Math.min(Math.floor(this.roundTime / 5) + 1, 20);
            // Adding points for drawer
            this.players.find(e => e.id == this.players[this.drawerIndex].id).points += 10;
            this.nextRound();
        }
        // Send message to all players 
        else {
            this.emit('chatMessage', { playerId: playerId, playerName: this.players.find(e => e.id == playerId).name, message: message });
        }
    }
}

module.exports = GameController;