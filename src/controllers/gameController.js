// KONTROLER GRY PO STRONIE SERWERA`

class GameController {
    constructor() {
        this.players = [];
    };

    addPlayer(playerId, playerName) {
        const player = {
            id: playerId,
            name: playerName,
            points: 0
        };
        this.players.push(player);
    };

    removePlayer(playerId) {
        this.players = this.players.filter(e => e.id != playerId)
    }
}

module.exports = GameController;