// LOGIKA GRY NA KLIENCIE

class Game {
    constructor(socket) {
        this.socket = socket;
        this.joinInput;
        this.joinButton;
    }

    init() {
        this.joinInput = document.getElementById('joinInput');
        this.joinButton = document.getElementById('joinButton');
        this.joinButton.addEventListener("click", () => this.join());
        this.socket.onJoinSuccess((data) => this.handleJoinSuccess(data));
    }

    join() {
        console.log("Joining...")
        const playerName = this.joinInput.value.trim();
        if (!playerName) {
            alert('Wpisz nazwę użytkownika');
            return;
        }
        this.socket.join(playerName)
    }

    handleJoinSuccess(data) {
        console.log(`Joined to game, player name: ${data.playerName}`);
        document.getElementById('joinScreen').style.display = 'none';
        document.getElementById('gameProgressScreen').style.display = 'block';
    }


}

export default Game;