class Population {
    constructor(m, num) {
        this.mutationRate = m;
        this.popSize = num;
        this.fireflys = [];
        this.matingPool = [];
        this.stats = { successRate: 0, avgFit: 0, maxFit: 0 };
        this.bestFireflyIndex = 0; // Tambahan: Menyimpan index terbaik

        for (let i = 0; i < this.popSize; i++) {
            this.fireflys[i] = new Firefly();
        }
    }

    evaluate() {
        let maxFit = 0;
        let totalFit = 0;
        let successCount = 0;
        this.bestFireflyIndex = 0; // Reset index terbaik

        for (let i = 0; i < this.popSize; i++) {
            this.fireflys[i].calcFitness();
            totalFit += this.fireflys[i].fitness;

            // Cek fitness tertinggi dan simpan indexnya
            if (this.fireflys[i].fitness > maxFit) {
                maxFit = this.fireflys[i].fitness;
                this.bestFireflyIndex = i; // Simpan index sang juara
            }

            if (this.fireflys[i].completed) successCount++;
        }

        // Simpan Data Statistik
        this.stats.successRate = (successCount / this.popSize) * 100;
        this.stats.avgFit = totalFit / this.popSize;
        this.stats.maxFit = maxFit;

        totalCompletedFireflys += successCount;

        // Normalisasi & Mating Pool
        this.matingPool = [];
        for (let i = 0; i < this.popSize; i++) {
            let fitnessNormal = map(this.fireflys[i].fitness, 0, maxFit, 0, 1);
            let n = floor(fitnessNormal * 100);
            for (let j = 0; j < n; j++) {
                this.matingPool.push(this.fireflys[i]);
            }
        }
    }

    selection() {
        let newFireflys = [];

        // --- FITUR ELITISME ---
        // 1. Ambil DNA juara dari generasi sebelumnya
        let bestDNA = this.fireflys[this.bestFireflyIndex].dna;

        // 2. Masukkan Juara ke slot pertama (tanpa diapa-apakan)
        // Kita buat copy DNA-nya agar referensinya aman
        let championDNA = new DNA(bestDNA.genes.slice());
        newFireflys[0] = new Firefly(championDNA);
        newFireflys[0].isChampion = true; // Opsional: Tandai juara agar bisa diwarnai beda

        // 3. Isi sisa populasi (mulai dari index 1, bukan 0) dengan cara biasa
        for (let i = 1; i < this.fireflys.length; i++) {
            let parentA = random(this.matingPool).dna;
            let parentB = random(this.matingPool).dna;
            let childDNA = parentA.crossover(parentB);
            childDNA.mutation(this.mutationRate);
            newFireflys[i] = new Firefly(childDNA);
        }

        this.fireflys = newFireflys;
    }

    run() {
        for (let i = 0; i < this.popSize; i++) {
            this.fireflys[i].update();
            this.fireflys[i].show();
        }
    }
}