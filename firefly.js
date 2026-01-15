class Firefly {
    constructor(dna) {
        // Posisi awal di bawah tengah
        this.pos = createVector(width / 2, height - 20);
        this.vel = createVector();
        this.acc = createVector();
        // DNA tetap sama
        this.dna = dna || new DNA();
        this.fitness = 0;
        this.completed = false;
        this.crashed = false;
        this.finishTime = 0;
    }

    applyForce(force) {
        this.acc.add(force);
    }

    calcFitness() {
        // Logika fitness tetap sama (Fisika tidak berubah)
        let d = dist(this.pos.x, this.pos.y, target.x, target.y);
        this.fitness = map(d, 0, width, width, 0);

        if (this.completed) {
            this.fitness *= 10;
            this.fitness *= map(this.finishTime, 0, lifespan, 10, 1);
        }
        if (this.crashed) {
            this.fitness /= 10;
        }
        this.fitness = pow(this.fitness, 2);
    }

    update() {
        // Logika update fisik tetap sama
        let d = dist(this.pos.x, this.pos.y, target.x, target.y);

        if (d < 24) { // Jarak toleransi sedikit diperbesar untuk "cahaya"
            this.completed = true;
            this.pos = target.copy();
            if (this.finishTime === 0) this.finishTime = lifeCounter;
        }

        for (let obs of obstacles) {
            if (obs.contains(this.pos)) this.crashed = true;
        }

        if (this.pos.x > width || this.pos.x < 0 || this.pos.y > height || this.pos.y < 0) {
            this.crashed = true;
        }

        if (!this.completed && !this.crashed) {
            this.applyForce(this.dna.genes[lifeCounter]);
            this.vel.add(this.acc);
            this.pos.add(this.vel);
            this.acc.mult(0);
            this.vel.limit(4);
        }
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);

        // VISUAL BARU: KUNANG-KUNANG
        noStroke();

        if (this.completed) {
            // Jika sampai target: Menjadi Putih Terang
            fill(255);
        } else if (this.crashed) {
            // Jika mati: Menjadi Merah Redup
            fill(255, 0, 0, 100);
        } else {
            // Normal: Kuning Emas (Gold) dengan transparansi
            fill(255, 215, 0, 150);
        }

        // Efek "Glow" sederhana (Lingkaran berlapis)
        // Lapisan luar (pendaran cahaya)
        if (!this.crashed) {
            fill(255, 215, 0, 50);
            ellipse(0, 0, 12, 12);
        }

        // Inti cahaya
        fill(255, 255, 200); // Putih kekuningan di tengah
        ellipse(0, 0, 4, 4);  // Titik kecil

        pop();
    }
}