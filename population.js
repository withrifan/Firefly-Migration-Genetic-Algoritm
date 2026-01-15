class Population {
    constructor(m, num) {
        this.mutationRate = m;
        this.popSize = num;
        this.fireflys = [];
        this.matingPool = [];
        this.stats = { successRate: 0, avgFit: 0, maxFit: 0 };

        for (let i = 0; i < this.popSize; i++) {
            this.fireflys[i] = new Firefly();
        }
    }

    evaluate() {
        let maxFit = 0;
        let totalFit = 0;
        let successCount = 0;

        for (let i = 0; i < this.popSize; i++) {
            this.fireflys[i].calcFitness();
            totalFit += this.fireflys[i].fitness;
            if (this.fireflys[i].fitness > maxFit) maxFit = this.fireflys[i].fitness;
            if (this.fireflys[i].completed) successCount++;
        }

        // Simpan Data Statistik
        this.stats.successRate = (successCount / this.popSize) * 100;
        this.stats.avgFit = totalFit / this.popSize;
        this.stats.maxFit = maxFit;

        // Update Total Global di Interface
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
        for (let i = 0; i < this.fireflys.length; i++) {
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