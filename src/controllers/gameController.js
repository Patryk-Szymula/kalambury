// GAME CONTROLLER ON SERVER

class GameController {
    constructor(dbController) {
        this.dbController = dbController; // Database controller
        this.callbacks = {}; // Callbacks container
        this.maxRound = 10; // Maximum round number
        this.maxRoundTime = 10; // Maximum round time
        this.roundTimer = null; // Round timer 
        this.init(); // Initialize default settings of a game
    };

    init() {
        this.players = []; // Players list
        this.gameStarted = false; // If game started flag
        this.drawerIndex = 0; // Current drawer index
        this.roundIndex = 1; // Current round index
        this.currentAnswer = "hasło"; // Current word to guess
        this.drawHistory = []; // Drawing history container
        if (this.roundTimer) clearInterval(this.roundTimer);
        this.timeLeft = this.maxRoundTime; // Round time left
        this.hint = false; // Hint flag
    }

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
        this.emit('playersUpdate', { players: this.players });
    }

    // Removing player
    removePlayer(playerId) {
        let playerIndex = this.players.findIndex(e => e.id == playerId);
        let wasHost = this.players.find(e => e.id == playerId).isHost

        // Remove player
        this.players = this.players.filter(e => e.id != playerId);
        console.log("Player disconnected, players list:");
        console.log(this.players);

        if (this.players.length > 1 && this.gameStarted) {
            // Change host
            if (wasHost && this.players.length > 0)
                this.players[0].isHost = true;
            // Change drawer
            if (playerIndex < this.drawerIndex) {
                this.drawerIndex--;
            }
            // Change drawer and round if it was his turn
            else if (playerIndex == this.drawerIndex) {
                this.drawerIndex--;
                this.nextRound();
            }
            // Update clients with current players list
            this.emit('playersUpdate', { players: this.players });
        } else if (this.players.length >= 1 && !this.gameStarted) {
            // Change host
            if (wasHost && this.players.length > 0)
                this.players[0].isHost = true;
            // Update clients with current players list
            this.emit('playersUpdate', { players: this.players });
        } else {
            this.endGame(); // End game if there is only 1 player left and game is in progress
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
        this.drawHistory = [];
        this.currentAnswer = this.dbController.getRandomWord();
        this.hint = false;

        console.log(this.players)
        console.log(`Round: ${this.roundIndex}`)
        console.log(`Drawer: ${this.players[this.drawerIndex].name}`)
        console.log(`Answer: ${this.currentAnswer}`)
        // Sending new round information to all players
        this.emit('startRound', { round: this.roundIndex, drawer: this.players[this.drawerIndex], roundTime: this.maxRoundTime, currentAnswer: this.currentAnswer, players: this.players });

        // Round timer
        this.timeLeft = this.maxRoundTime;
        this.roundTimer = setInterval(() => {
            this.timeLeft--;
            this.emit('timeUpdate', { timeLeft: this.timeLeft });
            if (this.timeLeft / this.maxRoundTime <= 0.5 && !this.hint) {
                this.hint = true;
                this.emit('chatMessage', { playerId: null, playerName: "Podpowiedź", message: `${this.currentAnswer[0]}...` });
            }
            if (this.timeLeft <= 0) {
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
        } else {
            this.endGame();
        }
    }

    // Ending game
    endGame() {
        console.log("Ending game...");
        this.gameStarted = false;
        this.dbController.insertResult(this.players.sort((a, b) => b.points - a.points)[0]);
        this.emit('endGame', { players: this.players });
        this.init();
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
            // Send message about correct answer
            this.emit('chatMessage', { playerId: null, playerName: `Gracz ${this.players.find(e => e.id == playerId).name} odgadł`, message: `${this.currentAnswer.toUpperCase()}` });
            // Adding points for player who guessed correct answer
            this.players.find(e => e.id == playerId).points += Math.min(Math.floor(this.timeLeft / 5) + 1, this.maxRoundTime / 5);
            // Adding points for drawer
            this.players.find(e => e.id == this.players[this.drawerIndex].id).points += 10;
            this.nextRound();
        }
        // Send hint when close to correct answer
        else if (this.optimalStringAlignmentDistance(message.toLowerCase(), this.currentAnswer.toLowerCase()) == 1 && playerId != this.players[this.drawerIndex].id) {
            // Send message (hint) to typing player
            this.emit('closeAnswerHint', { playerId: null, playerName: "Podpowiedź", message: `Jesteś bardzo blisko!`, toPlayerId: playerId });
        }
        // Send message to all players 
        else {
            this.emit('chatMessage', { playerId: playerId, playerName: this.players.find(e => e.id == playerId).name, message: message });
        }
    }

    // Damerau-Levenshtein Distance Algorithm
    // https://www.geeksforgeeks.org/damerau-levenshtein-distance/
    optimalStringAlignmentDistance(s1, s2) {

        // Create a table to store the results of subproblems
        let dp = new Array(s1.length + 1).fill(0)
            .map(() => new Array(s2.length + 1).fill(0));


        // Initialize the table
        for (let i = 0; i <= s1.length; i++) {
            dp[i][0] = i;
        }
        for (let j = 0; j <= s2.length; j++) {
            dp[0][j] = j;
        }

        // Populate the table using dynamic programming
        for (let i = 1; i <= s1.length; i++) {
            for (let j = 1; j <= s2.length; j++) {
                if (s1[i - 1] === s2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                }
                else {
                    dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
                }
            }
        }

        // Return the edit distance
        return dp[s1.length][s2.length];
    }
}

module.exports = GameController;