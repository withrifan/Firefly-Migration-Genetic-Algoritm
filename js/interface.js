let popSizeInput;       // Kotak input untuk jumlah populasi
let lifespanInput;      // Kotak input untuk durasi hidup (lama waktu per generasi)
let mutationInput;      // Kotak input untuk tingkat mutasi
let difficultySel;      // Dropdown untuk memilih tingkat kesulitan
let restartBtn;         // Tombol merah "Apply & Restart"
let statGen, statCycles, statSuccess, statAvgFit, statMaxFit, statTotalSuccess; // Elemen teks statistik
let modalOverlay;       // Layar hitam transparan untuk popup kemenangan
let speedSlider, speedLabel; // Fitur slider kecepatan

// FUNGSI UTAMA: MEMBANGUN DASHBOARD 
// Dipanggil satu kali saat 'setup()' di sketch.js berjalan
function setupDashboard() {
    // Persiapan Container
    let mainContainer = select('#main-container');

    // Cek apakah dashboard lama sudah ada? Jika ya, hapus dulu.
    // Ini berguna jika kita melakukan hot-reload code tanpa refresh halaman.
    let oldDash = select('.dashboard');
    if (oldDash) oldDash.remove();

    // Buat wadah utama dashboard
    let dashboard = createDiv('').class('dashboard').parent(mainContainer);

    // STATISTIK
    // Informasi Generasi
    let box1 = createDiv('<h4>Generation Info</h4>').class('stat-box').parent(dashboard);
    statGen = createDiv('Gen: 1').class('val').parent(box1);
    statCycles = createDiv('Time: 0').class('val').style('font-size', '14px').style('color', '#ddd').parent(box1);

    // Tingkat Kesuksesan
    let box2 = createDiv('<h4>Success Rate</h4>').class('stat-box').parent(dashboard);
    statSuccess = createDiv('0%').class('val').style('font-size', '24px').parent(box2);
    statAvgFit = createDiv('Avg Fit: 0').class('sub-val').parent(box2);

    // Rekor & Total
    let box3 = createDiv('<h4>Records</h4>').class('stat-box').parent(dashboard);
    statMaxFit = createDiv('Max Fit: 0').class('sub-val').parent(box3);
    createDiv('Total Completed').style('font-size', '10px').style('color', '#aaa').style('margin-top', '5px').parent(box3);
    statTotalSuccess = createDiv('0').class('val').style('color', '#3498db').parent(box3);

    // KONTROL (Input User) 
    let controlBox = createDiv('').class('control-box').parent(dashboard);

    // Input Populasi
    let groupPop = createDiv('<label>Populasi</label>').class('input-group').parent(controlBox);
    popSizeInput = createInput('10', 'number').parent(groupPop);
    popSizeInput.attribute('min', '10'); // Minimal 10 ekor

    // Input Lifespan (Durasi Hidup)
    let groupLife = createDiv('<label>Lifespan</label>').class('input-group').parent(controlBox);
    lifespanInput = createInput('500', 'number').parent(groupLife);
    lifespanInput.attribute('min', '100'); // Minimal 100 frame

    // Input Mutation Rate (Tingkat Mutasi)
    let groupMut = createDiv('<label>Mutation Rate</label>').class('input-group').parent(controlBox);
    mutationInput = createInput('0.0001', 'number').parent(groupMut); // Default 0.0001
    mutationInput.attribute('step', '0.0001');
    mutationInput.attribute('min', '0');
    mutationInput.attribute('max', '1');

    // Input Speed
    // Buat grup input seperti yang lain
    let groupSpeed = createDiv('<label>Speed</label>').class('input-group').parent(controlBox);

    // Buat Dropdown
    speedSel = createSelect().parent(groupSpeed);

    // Tambahkan Opsi (Label, Nilai)
    speedSel.option('1x', 1);   // Label "1x", Nilainya 1
    speedSel.option('2x', 2);   // Label "2x", Nilainya 2
    speedSel.option('5x', 5);   // Label "5x", Nilainya 5
    speedSel.option('10x', 10); // Label "10x", Nilainya 10

    // Set default ke 1x
    speedSel.selected(1);

    // Dropdown Kesulitan (Pilihan Level)
    let groupDiff = createDiv('<label>Jenis Rintangan</label>').class('input-group').parent(controlBox);
    difficultySel = createSelect().parent(groupDiff);
    difficultySel.option('Tanpa Rintangan', 'none');
    difficultySel.option('1 Rintangan', 'simple');
    difficultySel.option('Labirin', 'hard');
    difficultySel.option('Random Blocks', 'random');
    difficultySel.selected('none'); // Default terpilih Tanpa Rintangan

    // Tombol Restart
    restartBtn = createButton('APPLY & RESTART').parent(controlBox);
    // Saat tombol ditekan, panggil fungsi 'startSimulation' di sketch.js
    restartBtn.mousePressed(startSimulation);

    // Panggil fungsi untuk menyiapkan popup kemenangan (tapi belum ditampilkan)
    setupModal();
}

// POPUP KEMENANGAN
function setupModal() {
    // Buat layar gelap transparan (overlay) menutupi seluruh layar
    modalOverlay = createDiv('').class('modal-overlay').parent(document.body);

    // Buat kotak di tengah-tengah
    let box = createDiv('').class('modal-box').parent(modalOverlay);

    // Isi konten popup
    createElement('h2', 'MISI BERHASIL').parent(box);
    createDiv('Populasi berhasil mencapai target 100%').style('color', '#aaa').style('margin-bottom', '20px').parent(box);

    // Wadah untuk data statistik akhir nanti
    let statsContainer = createDiv('').id('modal-stats').parent(box);

    // Tombol "Main Lagi"
    let btn = createButton('MAIN LAGI').class('modal-btn').parent(box);
    btn.mousePressed(() => {
        modalOverlay.style('display', 'none'); // Sembunyikan popup
        startSimulation(); // Reset game
        loop(); // Jalankan animasi lagi
    });
}

// FUNGSI POPUP INTRO
// Dipanggil sekali saat halaman dibuka
function setupIntroModal() {
    // Buat layar gelap background
    let introOverlay = createDiv('').class('modal-overlay').style('display', 'flex').parent(document.body);

    // Buat Kotak Konten 
    let box = createDiv('').class('modal-box intro-box').parent(introOverlay);

    // Judul Project
    createElement('h2', 'Firefly Migration').parent(box);
    createDiv('Simulasi Evolusi dengan Algoritma Genetika').style('color', '#aaa').style('font-style', 'italic').style('margin-bottom', '15px').parent(box);

    // Konten Deskripsi
    let contentHTML = `
        <div class="intro-content">
            <p>
                Selamat datang! Program ini mensimulasikan bagaimana sekelompok kunang-kunang "belajar" 
                untuk bermigrasi melewati rintangan menuju target (Bulan) menggunakan prinsip evolusi biologi.
            </p>
            
            <h3>Cara Kerja:</h3>
            <ul>
                <li><b>Generasi Awal:</b> Kunang-kunang bergerak acak tanpa arah.</li>
                <li><b>Seleksi Alam:</b> Kunang-kunang yang paling dekat dengan target dianggap "unggul".</li>
                <li><b>Reproduksi:</b> Kunang-kunang unggul akan mewariskan DNA (pola gerakan) ke anaknya.</li>
                <li><b>Mutasi:</b> Terjadi perubahan acak kecil agar menemukan jalur baru yang lebih baik.</li>
            </ul>

            <h3>Fitur & Kontrol:</h3>
            <ul>
                <li>Gunakan <b>Speed Dropdown</b> untuk mempercepat proses belajar.</li>
                <li>Gunakan <b>Dropdown Rintangan</b> untuk mengubah tingkat kesulitan.</li>
                <li>Lihat statistik real-time pada Dashboard di bawah.</li>
            </ul>
        </div>
    `;
    createDiv(contentHTML).parent(box);

    // Tombol MULAI
    let btn = createButton('MULAI SIMULASI').class('modal-btn').parent(box);

    // Ketika tombol ditekan:
    btn.mousePressed(() => {
        introOverlay.style('display', 'none'); // Hilangkan popup
        loop(); // JALANKAN simulasi (p5.js loop)
    });
}

// FUNGSI UNTUK MENAMPILKAN POPUP
// Dipanggil oleh sketch.js saat successRate >= 99.9%
function showVictory() {
    let container = select('#modal-stats');
    container.html(''); // Bersihkan data lama

    // Fungsi kecil untuk menambah baris data dengan rapi
    const addRow = (label, value) => {
        let row = createDiv('').class('stat-row').parent(container);
        createSpan(label).style('color', '#ddd').parent(row);
        createSpan(value).style('font-weight', 'bold').parent(row);
    };

    // Masukkan data terakhir ke dalam popup
    addRow('Generasi', generationCount);
    addRow('Populasi', popSizeInput.value());
    addRow('Max Fitness', population.stats.maxFit.toFixed(4));
    addRow('Rata-rata Fitness', population.stats.avgFit.toFixed(4));

    // Ubah display menjadi 'flex' agar muncul
    modalOverlay.style('display', 'flex');
}

// FUNGSI UPDATE DATA REAL-TIME
// Dipanggil terus menerus di dalam draw() sketch.js (60x per detik)
function updateStatsUI() {
    // Update teks Generasi & Waktu
    statGen.html(`GEN: ${generationCount}`);
    statCycles.html(`Time: ${lifespan - lifeCounter}`); // Hitung mundur sisa waktu

    // Pastikan objek population sudah ada sebelum mengambil datanya
    if (population && population.stats) {
        // Tampilkan persentase sukses dengan 1 angka di belakang koma
        statSuccess.html(`${population.stats.successRate.toFixed(1)}%`);
        statAvgFit.html(`Avg Fitness: ${population.stats.avgFit.toFixed(2)}`);
        statMaxFit.html(`Max Fit: ${population.stats.maxFit.toFixed(2)}`);
        statTotalSuccess.html(totalCompletedFireflys);

        // Ubah warna teks sukses: Hijau jika > 50%, Merah jika belum
        if (population.stats.successRate > 50) statSuccess.style('color', '#2ecc71');
        else statSuccess.style('color', '#e74c3c');
    }
}