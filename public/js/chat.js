// CHAT SYSTEM

class Chat {
    constructor(socket) {
        this.socket = socket;
    }

    init() {
        // Register event listeners for buttons
        document.getElementById('chatButton').addEventListener("click", () => this.sendMessage());

        // Use Enter key to send a message
        document.getElementById('chatInput').addEventListener("keypress", (e) => {
            if (e.key === "Enter") this.sendMessage();
        });

        // Register client callbacks handlers
        this.socket.onChatMessage((data) => this.handleChatMessage(data));
    }

    // Send message function
    sendMessage() {
        const messageInput = document.getElementById('chatInput');
        const message = messageInput.value.trim();
        if (message) {
            this.socket.sendMessage(message);
            messageInput.value = ""; // Clearing the text box of a message after it has been sent
        }
    }

    // Handlers
    // Display message from the player
    handleChatMessage(data) {
        console.log("handleChatMessage");
        console.log(data);

        // Create container for a single message
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');

        // Highlight own message
        if (data.playerId === this.socket.getId()) {
            messageDiv.classList.add('ownMessage');
        } else if (data.playerId === null) {
            messageDiv.classList.add('hintMessage');
        }

        // Create and populate author name element
        const authorSpan = document.createElement('span');
        authorSpan.className = 'messageAuthor';
        authorSpan.textContent = data.playerName + ':';

        // Create and populate message content element
        const textSpan = document.createElement('span');
        textSpan.className = 'messageText';
        textSpan.textContent = ' ' + data.message;

        // Append spans to the message container
        messageDiv.appendChild(authorSpan);
        messageDiv.appendChild(textSpan);

        // Append message to chat box
        const messagesBox = document.getElementById('messagesBox');
        messagesBox.appendChild(messageDiv);

        // Scroll to the bottom to show the latest message
        messagesBox.scrollTop = messagesBox.scrollHeight;
    }
}

export default Chat;