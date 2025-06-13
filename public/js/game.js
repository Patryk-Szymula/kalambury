// GAME LOGIC ON CLIENT

import Canvas from './canvas.js';

class Game {
    constructor(socket) {
        this.socket = socket;
        this.players = [];
        this.drawing = new Canvas(socket);
    }

    init() {
        // Register event listeners for buttons
        document.getElementById('joinButton').addEventListener("click", () => this.join());
        document.getElementById('startButton').addEventListener("click", () => this.start());

        // Register client callbacks handlers
        this.socket.onJoinSuccess((data) => this.handleJoinSuccess(data));
        this.socket.onPlayersUpdate((data) => this.handlePlayersUpdate(data));
        this.socket.onGameStart((data) => this.handleGameStart(data));
        this.socket.onStartRound((data) => this.handleStartRound(data));
        this.socket.onTimeUpdate((data) => this.handleTimeUpdate(data));
        this.socket.onEndGame((data) => this.handleEndGame(data));
    }

    // Join game function - send joining player's name to the server
    join() {
        console.log("Joining...")
        const playerName = document.getElementById('joinInput').value.trim();
        if (!playerName) {
            alert('Wpisz nazwę użytkownika');
            return;
        }
        this.socket.join(playerName)
    }

    // Start game function - allows start only if there is minimum 2 players
    start() {
        console.log("Starting...")
        if (this.players.length < 2) {
            alert('Poczekaj na innych graczy');
            return;
        }
        this.socket.startGame()
    }

    // Callback handlers
    // Change screen after joining the game
    handleJoinSuccess(data) {
        console.log("handleJoinSuccess")
        console.log(data)
        document.getElementById('joinScreen').classList.add('d-none');
        console.log(!data.gameStarted)
        if (!data.gameStarted) {
            document.getElementById('lobbyScreen').classList.remove('d-none');
        } else {
            document.getElementById('gameProgressScreen').classList.remove('d-none');
            this.handleStartRound(data.roundInfo);
            console.log(data.drawHistory)
            data.drawHistory.forEach(e => {
                this.drawing.drawLine(e.fromX, e.toX, e.fromY, e.toY, e.color);
            })
        }
    }

    // Update player list, show start button for host
    handlePlayersUpdate(data) {
        console.log("handlePlayersUpdate")
        console.log(data)
        this.players = data.players;

        if (data.players.find(e => e.isHost).id == this.socket.getId()) {
            document.getElementById('startButton').style.display = 'block';
        } else {
            document.getElementById('startButton').style.display = 'none';
        }

        document.getElementById('playerCount').innerHTML = this.players.length;
    }

    // Change screen after starting the game
    handleGameStart(data) {
        console.log("handleGameStart")
        console.log(data)

        document.getElementById('lobbyScreen').classList.add('d-none');
        document.getElementById('gameProgressScreen').classList.remove('d-none');
    }

    // Update new round information
    handleStartRound(data) {
        console.log("handleStartRound")
        console.log(data)

        document.getElementById('timer').innerHTML = data.roundTime;
        document.getElementById('roundCount').innerHTML = data.round;
        document.getElementById('drawerName').innerHTML = data.drawer.name;
        document.getElementById('currentAnswer').innerHTML = data.currentAnswer;

        console.log(document.getElementById('drawerName').parentNode.style.display)

        if (data.drawer.id == this.socket.getId()) {
            document.getElementById('drawerNameText').style.display = 'none';
            document.getElementById('currentAnswerText').style.display = 'block';
            this.drawing.setForDrawer();
        } else {
            document.getElementById('drawerNameText').style.display = 'block';
            document.getElementById('currentAnswerText').style.display = 'none';
            this.drawing.setForPlayers();
        }

        this.drawing.clear();
    }

    // Update remaining time of round
    handleTimeUpdate(data) {
        console.log("handleTimeUpdate")
        console.log(data)

        document.getElementById('timer').innerHTML = data.timeLeft;
    }

    // End game
    handleEndGame(data) {
        console.log("handleEndGame")
        console.log(data)


    }
}

export default Game;