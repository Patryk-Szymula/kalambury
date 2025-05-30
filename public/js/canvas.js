// DRAWING SYSTEM

class Drawing {
    constructor(canvasId, colorPickerId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.colorPicker = document.getElementById(colorPickerId);
        this.currentColor = 'black';
        this.drawing = false;

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
    }

    startDraw(e) {
        this.drawing = true;
        this.ctx.beginPath();
        this.ctx.moveTo(e.offsetX, e.offsetY);
    }

    draw(e) {
        if (!this.drawing) return;
        this.ctx.lineTo(e.offsetX, e.offsetY);
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = (this.currentColor === 'white') ? 15 : 3;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();
    }

    stopDraw() {
        this.drawing = false;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

export default Drawing;
