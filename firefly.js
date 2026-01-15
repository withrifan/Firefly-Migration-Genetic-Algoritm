class Firefly {
    constructor(dna) {
        // PERGERAKAN
        // Posisi awal: Mulai di tengah bawah layar
        this.pos = createVector(width / 2, height - 20);
        // Velocity (Kecepatan): Seberapa cepat dia bergerak
        this.vel = createVector();
        // Acceleration (Percepatan): Gaya dorong yang mengubah kecepatan
        this.acc = createVector();

        // GENETIKA
        // Jika ada DNA (dari orang tua), pakai itu. Jika tidak, buat DNA baru (random).
        this.dna = dna || new DNA();

        // STATUS & SKOR 
        this.fitness = 0;       // Skor seberapa bagus performanya
        this.completed = false; // Apakah sudah mencapai target?
        this.crashed = false;   // Apakah menabrak tembok?
        this.finishTime = 0;    // Mencatat waktu tiba (untuk bonus kecepatan)
    }

    // Fungsi Fisika: Menambahkan gaya dorong ke percepatan
    applyForce(force) {
        this.acc.add(force);
    }

    // MENGHITUNG SKOR (FITNESS)
    // Dipanggil di akhir generasi untuk menentukan siapa yang boleh berkembang biak.
    calcFitness() {
        // Hitung jarak antara posisi kunang-kunang dengan target
        let d = dist(this.pos.x, this.pos.y, target.x, target.y);

        // Petakan jarak ke skor (Semakin DEKAT jaraknya, semakin TINGGI skornya)
        // Jika jarak 0 (sampai), skor = width. Jika jarak jauh, skor mendekati 0.
        this.fitness = map(d, 0, width, width, 0);

        // Berikan Bonus jika BERHASIL sampai (Completed)
        if (this.completed) {
            this.fitness *= 10; // Kalikan skor 10x lipat
            // Bonus Kecepatan: Semakin cepat sampai (finishTime kecil), bonus makin besar
            this.fitness *= map(this.finishTime, 0, lifespan, 10, 1);
        }

        // Berikan Hukuman jika MENABRAK (Crashed)
        if (this.crashed) {
            this.fitness /= 10; // Bagi skor jadi sepersepuluhnya
        }

        // Eksponensial: Pangkatkan skor agar perbedaan antara yang "bagus" dan "biasa" terlihat jauh
        // Ini membantu algoritma memilih bibit unggul dengan lebih tegas.
        this.fitness = pow(this.fitness, 2);
    }

    // LOGIKA SETIAP FRAME (UPDATE)
    update() {
        // Cek jarak ke target setiap saat
        let d = dist(this.pos.x, this.pos.y, target.x, target.y);

        // Cek Kemenangan
        if (d < 24) { // Jika jarak kurang dari 24px, dianggap sampai
            this.completed = true;
            this.pos = target.copy(); // Paksa posisi diam di target
            // Catat waktu finish jika belum tercatat
            if (this.finishTime === 0) this.finishTime = lifeCounter;
        }

        // Cek Tabrakan dengan Rintangan
        for (let obs of obstacles) {
            if (obs.contains(this.pos)) this.crashed = true;
        }

        // Cek Tabrakan dengan Tepi Layar
        if (this.pos.x > width || this.pos.x < 0 || this.pos.y > height || this.pos.y < 0) {
            this.crashed = true;
        }

        // Jika MASIH HIDUP (belum sampai & belum mati)
        if (!this.completed && !this.crashed) {
            // Ambil gen (vektor gaya) sesuai urutan waktu saat ini (lifeCounter)
            this.applyForce(this.dna.genes[lifeCounter]);

            // Update Fisika: Percepatan -> Kecepatan -> Posisi
            this.vel.add(this.acc);
            this.pos.add(this.vel);

            // Reset percepatan ke 0 untuk frame berikutnya
            this.acc.mult(0);

            // Batasi kecepatan maksimum agar tidak teleportasi/terlalu cepat
            this.vel.limit(4);
        }
    }

    // VISUALISASI GAMBAR
    show() {
        push(); // Simpan settingan gambar sebelumnya
        translate(this.pos.x, this.pos.y); // Pindahkan titik koordinat ke posisi kunang-kunang

        noStroke();

        // Logika Warna Status
        if (this.completed) {
            // PUTIH: Sukses sampai target
            fill(255);
        } else if (this.crashed) {
            // MERAH REDUP: Mati menabrak
            fill(255, 0, 0, 100);
        } else {
            // EMAS (GOLD): Sedang terbang normal (transparan 150)
            fill(255, 215, 0, 150);
        }

        // Menggambar Efek "Glow"
        // Hanya gambar pendaran jika tidak mati
        if (!this.crashed) {
            fill(255, 215, 0, 50); // Warna emas sangat transparan
            ellipse(0, 0, 12, 12); // Lingkaran luar 
        }

        // Menggambar Inti Badan
        fill(255, 255, 200); // Putih kekuningan
        ellipse(0, 0, 4, 4);  // Titik kecil di tengah

        pop(); // Kembalikan settingan gambar
    }
}