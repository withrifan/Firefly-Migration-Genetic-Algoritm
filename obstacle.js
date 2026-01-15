class Obstacle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    show() {
        fill(255);
        rectMode(CORNER); // Pastikan mode corner untuk tembok
        rect(this.x, this.y, this.w, this.h);
    }

    contains(v) {
        return (v.x > this.x && v.x < this.x + this.w && v.y > this.y && v.y < this.y + this.h);
    }
}