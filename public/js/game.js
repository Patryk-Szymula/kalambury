// GAME LOGIC ON CLIENT

import Drawing from './canvas.js';

class Game {
    constructor(socket) {
        this.socket = socket;
        this.players = [];
        this.drawing = null;
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
        document.getElementById('joinScreen').style.display = 'none';
        console.log(!data.gameStarted)
        if (!data.gameStarted) {
            document.getElementById('lobbyScreen').style.display = 'block';
        } else {
            document.getElementById('gameProgressScreen').style.display = 'block';
        }
    }

    // Update player list, show start button for host
    handlePlayersUpdate(data) {
        console.log("handlePlayersUpdate")
        console.log(data)
        this.players = data.players;

        if (this.players.find(e => e.isHost).id == this.socket.getId()) {
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

        document.getElementById('lobbyScreen').style.display = 'none';
        document.getElementById('gameProgressScreen').style.display = 'block';
    }

    // Update new round information
    handleStartRound(data) {
        console.log("handleStartRound")
        console.log(data)

        document.getElementById('timer').innerHTML = data.roundTime;
        document.getElementById('roundCount').innerHTML = data.round;
        document.getElementById('drawerName').innerHTML = data.drawerName;

        const myName = this.socket.getPlayerName();
        const isDrawer = (myName === data.drawerName);

        const drawingSection = document.getElementById('drawingSection');
        drawingSection.style.display = isDrawer ? 'block' : 'none';

        if (isDrawer) {
            if (!this.drawing) {
                this.drawing = new Drawing('drawingCanvas', 'colorPicker');
            }
        } else {
            if (this.drawing) {
                this.drawing.clear();
                this.drawing = null;
            }
        }
    }

    // Update remaining time of round
    handleTimeUpdate(data) {
        console.log("handleTimeUpdate")
        console.log(data)

        document.getElementById('timer').innerHTML = data.timeLeft;
    }
}

export default Game;