// DRAWING SYSTEM

class Canvas {
    constructor(socket) {
        this.socket = socket;
        this.canvas = document.getElementById("drawingCanvas");
        this.ctx = this.canvas.getContext('2d');
        this.colorPicker = document.getElementById("colorPicker");
        this.currentColor = 'black';
        this.drawing = false;
        this.drawer = false;

        this.initEvents();
    }

    initEvents() {
        this.canvas.addEventListener('mousedown', (e) => this.startDraw(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDraw());
        this.canvas.addEventListener('mouseout', () => this.stopDraw());

        this.colorPicker.querySelectorAll('.color').forEach(button => {
            button.addEventListener('click', () => {
                this.currentColor = button.dataset.color;
            });
        });

        // Register client callbacks handlers
        this.socket.onDraw((data) => this.handleDraw(data));
    }

    startDraw(e) {
        if(!this.drawer)
            return;
        this.drawing = true;
        this.fromX = e.offsetX;
        this.fromY = e.offsetY;
    }

    stopDraw() {
        this.drawing = false;
    }

    draw(e) {
        if (!this.drawer || !this.drawing) return;
        this.toX = e.offsetX;
        this.toY = e.offsetY;
        
        this.drawLine(this.fromX, this.toX, this.fromY, this.toY, this.currentColor);

        this.socket.draw({fromX: this.fromX, toX: this.toX, fromY: this.fromY, toY: this.toY, color: this.currentColor});

        this.fromX = this.toX;
        this.fromY = this.toY;
    }

    drawLine(fromX, toX, fromY, toY, color){
        this.ctx.beginPath();
        this.ctx.moveTo(fromX, fromY);
        this.ctx.lineTo(toX, toY);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = (color === 'white') ? 15 : 3;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    setForDrawer() {
        document.getElementById("colorPicker").style.display = "flex";
        document.getElementById("drawingCanvas").style.cursor = "crosshair";
        this.drawer = true;
    }

    setForPlayers() {
        document.getElementById("colorPicker").style.display = "none";
        document.getElementById("drawingCanvas").style.cursor = "inherit";
        this.drawer = false;
    }

    // Handlers
    // Draw sync
    handleDraw(data) {
        console.log("handleDraw");
        console.log(data);

        this.drawLine(data.fromX, data.toX, data.fromY, data.toY, data.color);
    }
}

export default Canvas;
