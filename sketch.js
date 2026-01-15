// --- KONFIGURASI GLOBAL ---
let population;
let lifespan = 400; // Default, nanti diupdate dari input
let lifeCounter = 0;
let target;
let maxForce = 0.2;
let obstacles = [];
let generationCount = 1;
let totalCompletedFireflys = 0; // Pastikan nama variabel ini konsisten

function setup() {
    let canvas = createCanvas(800, 600);
    canvas.parent('main-container');

    setupDashboard();
    target = createVector(width / 2, 50);

    startSimulation();
}

function draw() {
    // Background Malam
    background(10, 10, 30);

    // Gambar Target (Bulan)
    noStroke();
    fill(255, 255, 255, 20); ellipse(target.x, target.y, 60, 60);
    fill(255, 255, 255, 50); ellipse(target.x, target.y, 45, 45);
    fill(255, 255, 240); ellipse(target.x, target.y, 30, 30);

    // Gambar Obstacles
    fill(80, 80, 90); // Warna tembok beton/batu
    for (let obs of obstacles) obs.show();

    population.run();

    lifeCounter++;
    updateStatsUI();

    if (lifeCounter >= lifespan) { // Gunakan >= untuk keamanan jika lifespan diubah on-fly
        population.evaluate();

        // --- UPDATE LOGIKA FINISH ---
        // Cek apakah success rate mencapai 100%
        // Kita gunakan >= 99.9 untuk antisipasi pembulatan floating point
        if (population.stats.successRate >= 99.9) {
            updateStatsUI(); // Update UI terakhir kali sebelum freeze
            console.log("Victory!");

            showVictory(); // <--- Panggil Popup yang kita buat tadi

            noLoop(); // Hentikan game (Freeze)
            return;   // Keluar agar tidak lanjut ke selection
        }

        population.selection();
        lifeCounter = 0;
        generationCount++;
    }
}

function startSimulation() {
    // 1. Ambil Nilai Populasi
    let popVal = parseInt(popSizeInput.value()) || 100;
    if (popVal < 10) popVal = 10;

    // 2. Ambil Nilai Lifespan
    let lifeVal = parseInt(lifespanInput.value()) || 400;
    if (lifeVal < 100) lifeVal = 100;

    // 3. Ambil Nilai Mutation Rate
    let mutVal = parseFloat(mutationInput.value());
    if (isNaN(mutVal)) mutVal = 0.01;
    mutationRate = mutVal;

    // Sinkronisasi Input (Opsional, agar format rapi kembali ke input)
    popSizeInput.value(popVal);
    lifespanInput.value(lifeVal);
    mutationInput.value(mutationRate);

    // Update Variabel Global
    lifespan = lifeVal;
    lifeCounter = 0;
    generationCount = 1;
    totalCompletedFireflys = 0;

    // Buat Populasi Baru
    population = new Population(mutationRate, popVal);

    // 4. Setup Rintangan
    obstacles = [];
    let mode = difficultySel.value();

    if (mode === 'simple') {
        obstacles.push(new Obstacle(width / 2 - 100, height / 2, 200, 20));
    }
    else if (mode === 'hard') {
        obstacles.push(new Obstacle(width / 2 - 150, 200, 300, 20));
        obstacles.push(new Obstacle(0, 350, 300, 20));
        obstacles.push(new Obstacle(width - 300, 350, 300, 20));
    }
    else if (mode === 'random') {
        let count = 12;
        for (let i = 0; i < count; i++) {
            let rx = random(width);
            let ry = random(150, height - 150);
            let rw = random(50, 120);
            let rh = random(20, 40);
            obstacles.push(new Obstacle(rx, ry, rw, rh));
        }
    }

    loop();
}