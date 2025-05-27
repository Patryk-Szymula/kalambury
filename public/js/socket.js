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
    }

    join(playerName) {
        this.socket.emit('join', playerName)
    }

    onJoinSuccess(callback) {
        this.onJoinSuccessCallback = callback;
    }

}

export default Socket;