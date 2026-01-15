class Population {
    // Constructor: Menyiapkan populasi saat pertama kali simulasi dimulai
    // m = mutation rate (laju mutasi), num = jumlah populasi
    constructor(m, num) {
        this.mutationRate = m;
        this.popSize = num;
        this.fireflys = [];     // Wadah untuk menyimpan semua objek kunang-kunang
        this.matingPool = [];   // "Kolam Jodoh" untuk undian orang tua
        this.stats = { successRate: 0, avgFit: 0, maxFit: 0 }; // Data statistik untuk dashboard
        this.bestFireflyIndex = 0; // Menyimpan nomor urut kunang-kunang terbaik

        // Membuat kunang-kunang awal (Generasi 1)
        for (let i = 0; i < this.popSize; i++) {
            this.fireflys[i] = new Firefly();
        }
    }

    // Fungsi Evaluate: "Rapor Akhir Semester"
    // Dijalankan setiap kali satu generasi selesai (lifespan habis)
    evaluate() {
        let maxFit = 0;
        let totalFit = 0;
        let successCount = 0;
        this.bestFireflyIndex = 0; // Reset juara

        // 1. Hitung Nilai (Fitness) Setiap Kunang-kunang
        for (let i = 0; i < this.popSize; i++) {
            this.fireflys[i].calcFitness(); // Perintahkan kunang-kunang hitung skornya sendiri
            totalFit += this.fireflys[i].fitness;

            // Cari siapa yang nilainya paling tinggi (Juara Kelas)
            if (this.fireflys[i].fitness > maxFit) {
                maxFit = this.fireflys[i].fitness;
                this.bestFireflyIndex = i; // Tandai nomor urutnya
            }

            // Hitung berapa yang berhasil sampai finish
            if (this.fireflys[i].completed) successCount++;
        }

        // 2. Update Data Statistik (Untuk ditampilkan di UI)
        this.stats.successRate = (successCount / this.popSize) * 100;
        this.stats.avgFit = totalFit / this.popSize;
        this.stats.maxFit = maxFit;

        // Tambahkan ke total global (opsional, untuk rekor dunia)
        totalCompletedFireflys += successCount;

        // 3. Membuat "Mating Pool" (Kolam Jodoh / Undian)
        // Konsepnya: Semakin tinggi fitness, semakin banyak tiket undian yang didapat.
        this.matingPool = [];
        for (let i = 0; i < this.popSize; i++) {
            // Normalisasi fitness ke skala 0 sampai 1 (relatif terhadap juara)
            let fitnessNormal = map(this.fireflys[i].fitness, 0, maxFit, 0, 1);

            // Tentukan jumlah tiket (dikalikan 100 agar jadi bilangan bulat)
            let n = floor(fitnessNormal * 100);

            // Masukkan nama kunang-kunang ke dalam kolam sebanyak 'n' kali
            for (let j = 0; j < n; j++) {
                this.matingPool.push(this.fireflys[i]);
            }
        }
    }

    // Fungsi Selection: "Reproduksi / Regenerasi"
    // Menciptakan populasi baru berdasarkan orang tua dari Mating Pool
    selection() {
        let newFireflys = [];

        // --- FITUR ELITISME (JALUR PRESTASI) ---
        // Agar gen terbaik tidak hilang karena mutasi/kesialan,
        // kita langsung loloskan sang juara ke generasi berikutnya tanpa diubah.

        // 1. Ambil DNA juara
        let bestDNA = this.fireflys[this.bestFireflyIndex].dna;

        // 2. Copy DNA-nya (wajib pakai copy/slice agar tidak tembus referensinya)
        let championDNA = new DNA(bestDNA.genes.slice());

        // 3. Masukkan ke slot pertama (Absen No. 0)
        newFireflys[0] = new Firefly(championDNA);
        newFireflys[0].isChampion = true; // Tandai agar warnanya bisa dibedakan

        // --- REPRODUKSI BIASA UNTUK SISA POPULASI ---
        // Mulai dari index 1 karena index 0 sudah diisi sang juara
        for (let i = 1; i < this.fireflys.length; i++) {
            // A. Pilih dua orang tua secara acak dari kolam undian
            // (Ingat: yang nilainya bagus punya tiket lebih banyak di kolam ini)
            let parentA = random(this.matingPool).dna;
            let parentB = random(this.matingPool).dna;

            // B. Kawinkan DNA mereka (Crossover)
            let childDNA = parentA.crossover(parentB);

            // C. Berikan kemungkinan Mutasi (Perubahan acak)
            childDNA.mutation(this.mutationRate);

            // D. Lahirkan anak baru dengan DNA tersebut
            newFireflys[i] = new Firefly(childDNA);
        }

        // Ganti populasi lama dengan populasi baru
        this.fireflys = newFireflys;
    }

    // Fungsi Run: Menjalankan aktivitas sehari-hari populasi
    run() {
        for (let i = 0; i < this.popSize; i++) {
            this.fireflys[i].update(); // Bergerak
            this.fireflys[i].show();   // Tampil di layar
        }
    }
}