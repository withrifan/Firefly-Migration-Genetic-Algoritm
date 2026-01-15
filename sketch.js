// --- KONFIGURASI GLOBAL ---
let population;
let lifespan = 400;
let lifeCounter = 0;
let target;
let maxForce = 0.2;
let obstacles = [];
let generationCount = 1;
let totalCompletedFireflys = 0;

function setup() {
    // Canvas dimasukkan ke div 'main-container' di HTML
    let canvas = createCanvas(800, 600);
    canvas.parent('main-container');

    // Inisialisasi UI (dari Interface.js)
    setupDashboard();

    // Setup Posisi
    target = createVector(width / 2, 50);

    // Mulai
    startSimulation();
}

function draw() {
    // 1. BACKGROUND MALAM (Biru Sangat Gelap)
    background(10, 10, 30);

    // 2. GAMBAR TARGET (SEPERTI BULAN / LAMPU)
    // Efek pendaran (Glow) untuk target
    noStroke();
    fill(255, 255, 255, 20); // Cahaya luar transparan
    ellipse(target.x, target.y, 60, 60);
    fill(255, 255, 255, 50); // Cahaya tengah
    ellipse(target.x, target.y, 45, 45);
    fill(255, 255, 240);     // Inti Bulan (Putih Gading)
    ellipse(target.x, target.y, 30, 30);

    // 3. GAMBAR RINTANGAN (WARNA GELAP SEPERTI TEMBOK/POHON)
    fill(50, 60, 70); // Abu-abu gelap kebiruan
    for (let obs of obstacles) {
        rect(obs.x, obs.y, obs.w, obs.h); // Jangan panggil obs.show() bawaan, kita timpa warnanya di sini
    }
    // 3. Jalankan Logika Populasi
    population.run();

    // 4. Update UI & Waktu
    lifeCounter++;
    updateStatsUI(); // Fungsi dari Interface.js

    // 5. Pergantian Generasi
    if (lifeCounter == lifespan) {
        population.evaluate();
        population.selection();
        lifeCounter = 0;
        generationCount++;
    }
}

// Fungsi Restart Global
function startSimulation() {
    // Ambil nilai dari UI
    let val = parseInt(popSizeInput.value()) || 100;
    if (val < 10) val = 10;

    // Sinkron UI
    popSizeInput.value(val);
    popSizeSlider.value(val);

    // Reset Logic
    lifeCounter = 0;
    generationCount = 1;
    totalCompletedFireflys = 0;

    population = new Population(0.01, val);

    // Setup Obstacles sesuai Dropdown
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
}