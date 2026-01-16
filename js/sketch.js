let population;             // Objek yang mengatur ribuan kunang-kunang
let lifespan = 500;         // Durasi hidup per generasi (jumlah frame/langkah)
let lifeCounter = 0;        // Penghitung waktu saat ini (0 sampai lifespan)
let target;                 // Posisi tujuan (Bulan)
let maxForce = 0.2;         // Batas kekuatan gaya manuver kunang-kunang
let obstacles = [];         // Array untuk menyimpan daftar rintangan tembok
let generationCount = 1;    // Mencatat ini generasi ke-berapa
let totalCompletedFireflys = 0; // Statistik total yang berhasil

// FUNGSI SETUP 
function setup() {
    // Membuat kanvas ukuran 800x600 px
    let canvas = createCanvas(800, 600);
    // Masukkan kanvas ke dalam elemen HTML div id="main-container"
    canvas.parent('main-container');

    // Menyiapkan UI (Tombol, Input, Statistik) dari file interface.js
    setupDashboard();

    // Menentukan posisi target di tengah atas layar
    target = createVector(width / 2, 50);

    // Memulai simulasi pertama kali
    startSimulation();
}

// FUNGSI DRAW
function draw() {
    // Gambar Background Malam 
    background(10, 10, 30);

    // Gambar Target 
    noStroke();
    fill(255, 255, 255, 20); ellipse(target.x, target.y, 60, 60); // luar
    fill(255, 255, 255, 50); ellipse(target.x, target.y, 45, 45); // Tengah
    fill(255, 255, 240); ellipse(target.x, target.y, 30, 30);     // Inti lampu

    // Gambar Semua Obstacles (Tembok)
    fill(80, 80, 90);
    for (let obs of obstacles) obs.show();

    // Update & Gambar Populasi (Gerakkan kunang-kunang)
    population.run();

    // Update Waktu & UI
    lifeCounter++; // Waktu berjalan maju
    updateStatsUI(); // Perbarui angka di dashboard

    // PERGANTIAN GENERASI
    // Cek apakah durasi hidup generasi ini sudah habis?
    if (lifeCounter >= lifespan) {

        // Beri nilai untuk semua kunang-kunang
        population.evaluate();

        // Jika 99.9% populasi berhasil sampai, kita anggap menang
        if (population.stats.successRate >= 99.9) {
            updateStatsUI();
            console.log("Victory!");
            showVictory(); // Tampilkan Popup Berhasil
            noLoop();      // Hentikan animasi (Freeze)
            return;        // Keluar fungsi, jangan lanjut evolusi
        }

        // SELEKSI & REPRODUKSI (Evolusi)
        // Membuat anak baru dari orang tua terbaik
        population.selection();

        // RESET WAKTU
        lifeCounter = 0;      // Reset jam ke 0
        generationCount++;    // Generasi bertambah
    }
}

// FUNGSI START/RESTART SIMULASI
// Dipanggil saat awal loading atau saat tombol "Apply & Restart" ditekan
function startSimulation() {
    // Ambil & Validasi Nilai Populasi dari Input HTML
    let popVal = parseInt(popSizeInput.value()) || 100;
    if (popVal < 10) popVal = 10; // Minimal 10 ekor

    // Ambil & Validasi Nilai Lifespan
    let lifeVal = parseInt(lifespanInput.value()) || 400;
    if (lifeVal < 100) lifeVal = 100; // Minimal 100 frame

    // Ambil Nilai Mutation Rate
    let mutVal = parseFloat(mutationInput.value());
    if (isNaN(mutVal)) mutVal = 0.01; // Default 1%
    mutationRate = mutVal; // Simpan ke variabel global agar dibaca Population

    // Tulis ulang nilai yang sudah divalidasi ke input box (agar rapi)
    popSizeInput.value(popVal);
    lifespanInput.value(lifeVal);
    mutationInput.value(mutationRate);

    // Update Variabel Global
    lifespan = lifeVal;
    lifeCounter = 0;
    generationCount = 1;
    totalCompletedFireflys = 0;

    // BUAT POPULASI BARU 
    // Hapus populasi lama, buat baru dengan parameter yang diinput user
    population = new Population(mutationRate, popVal);

    // Setup Rintangan (Level Design)
    obstacles = []; // Kosongkan tembok lama
    let mode = difficultySel.value(); // Cek pilihan dropdown

    if (mode === 'simple') {
        // Satu tembok di tengah
        obstacles.push(new Obstacle(width / 2 - 100, height / 2, 200, 20));
    }
    else if (mode === 'hard') {
        // Tiga tembok (Labirin sederhana)
        obstacles.push(new Obstacle(width / 2 - 150, 200, 300, 20));
        obstacles.push(new Obstacle(0, 350, 300, 20));
        obstacles.push(new Obstacle(width - 300, 350, 300, 20));
    }
    else if (mode === 'random') {
        // Generate tembok acak
        let count = 12;
        for (let i = 0; i < count; i++) {
            let rx = random(width);
            let ry = random(150, height - 150); // Jaga jarak aman dari start & finish
            let rw = random(50, 120);
            let rh = random(20, 40);
            obstacles.push(new Obstacle(rx, ry, rw, rh));
        }
    }

    // Jalankan loop animasi lagi (berjaga-jaga jika sebelumnya di-stop/noLoop)
    loop();
}