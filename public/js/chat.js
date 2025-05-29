// WIADOMOŚCI GRACZY

class Chat {
    constructor(socket) {
        this.socket = socket;
    }

    init() {
        document.getElementById('chatButton').addEventListener("click", () => this.sendMessage());

        this.socket.onChatMessage((data) => this.handleChatMessage(data));
    }

    sendMessage() {
        console.log("Sending message...");
        const message = document.getElementById('chatInput').value.trim();
        if (message) {
            this.socket.sendMessage(message);
        }
    }

    handleChatMessage(data) {
        console.log("handleChatMessage")
        console.log(data)

        if (data.playerId == this.socket.getId())
            document.getElementById('messageAuthor').style.fontWeight = "bold";
        else
            document.getElementById('messageAuthor').style.fontWeight = "normal";
        document.getElementById('messageAuthor').innerHTML = data.playerName;
        document.getElementById('messageText').innerHTML = data.message;
    }
}

export default Chat;