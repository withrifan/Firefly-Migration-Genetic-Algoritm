class Population {
    // Constructor: Menyiapkan populasi saat pertama kali simulasi dimulai
    // m = mutation rate (laju mutasi), num = jumlah populasi
    constructor(m, num) {
        this.mutationRate = m;
        this.popSize = num;
        this.fireflys = [];     // Wadah untuk menyimpan semua objek kunang-kunang
        this.matingPool = [];   // Wadah untuk undian parent
        this.stats = { successRate: 0, avgFit: 0, maxFit: 0 }; // Data statistik untuk dashboard
        this.bestFireflyIndex = 0; // Menyimpan nomor urut kunang-kunang terbaik

        // Membuat kunang-kunang awal (Generasi 1)
        for (let i = 0; i < this.popSize; i++) {
            this.fireflys[i] = new Firefly();
        }
    }

    // Fungsi Evaluate
    // Dijalankan setiap kali satu generasi selesai (lifespan habis)
    evaluate() {
        let maxFit = 0;
        let totalFit = 0;
        let successCount = 0;
        this.bestFireflyIndex = 0; // Reset juara

        // Hitung Nilai (Fitness) Setiap Kunang-kunang
        for (let i = 0; i < this.popSize; i++) {
            this.fireflys[i].calcFitness(); // Perintahkan kunang-kunang hitung skornya sendiri
            totalFit += this.fireflys[i].fitness;

            // Cari siapa yang nilainya paling tinggi
            if (this.fireflys[i].fitness > maxFit) {
                maxFit = this.fireflys[i].fitness;
                this.bestFireflyIndex = i; // Tandai nomor urutnya
            }

            // Hitung berapa yang berhasil sampai finish
            if (this.fireflys[i].completed) successCount++;
        }

        // Update Data Statistik (Untuk ditampilkan di UI)
        this.stats.successRate = (successCount / this.popSize) * 100;
        this.stats.avgFit = totalFit / this.popSize;
        this.stats.maxFit = maxFit;

        // Tambahkan ke total global
        totalCompletedFireflys += successCount;

        // Membuat "Mating Pool"
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

    // Fungsi Selection: Regenerasi
    // Menciptakan populasi baru berdasarkan orang tua dari Mating Pool
    selection() {
        let newFireflys = [];

        // FITUR ELITISME
        // Agar gen terbaik tidak hilang karena mutasi/kesialan,
        // kita langsung loloskan sang juara ke generasi berikutnya tanpa diubah.

        // Ambil DNA juara
        let bestDNA = this.fireflys[this.bestFireflyIndex].dna;

        // Copy DNA-nya
        let championDNA = new DNA(bestDNA.genes.slice());

        // Masukkan ke slot pertama 
        newFireflys[0] = new Firefly(championDNA);
        newFireflys[0].isChampion = true; // Tandai agar warnanya bisa dibedakan

        // REPRODUKSI BIASA UNTUK SISA POPULASI
        // Mulai dari index 1 karena index 0 sudah diisi sang juara
        for (let i = 1; i < this.fireflys.length; i++) {
            // Pilih dua orang tua secara acak dari kolam undian
            // yang nilainya bagus punya tiket lebih banyak di kolam ini
            let parentA = random(this.matingPool).dna;
            let parentB = random(this.matingPool).dna;

            // Kawinkan DNA mereka (Crossover)
            let childDNA = parentA.crossover(parentB);

            // Berikan kemungkinan Mutasi (Perubahan acak)
            childDNA.mutation(this.mutationRate);

            // Lahirkan anak baru dengan DNA tersebut
            newFireflys[i] = new Firefly(childDNA);
        }

        // Ganti populasi lama dengan populasi baru
        this.fireflys = newFireflys;
    }

    // UPDATE: Hanya menghitung fisika (bisa di-loop berkali-kali)
    update() {
        for (let i = 0; i < this.popSize; i++) {
            this.fireflys[i].update();
        }
    }

    // SHOW: Hanya menggambar (dipanggil sekali per frame)
    show() {
        for (let i = 0; i < this.popSize; i++) {
            this.fireflys[i].show();
        }
    }


}