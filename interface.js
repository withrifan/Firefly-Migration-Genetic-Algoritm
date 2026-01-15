// File: interface.js

// Variabel UI Global
let popSizeInput; // Hapus popSizeSlider
let lifespanInput; // Hapus lifespanSlider
let mutationInput; // Hapus mutationSlider
let difficultySel;
let restartBtn;
let statGen, statCycles, statSuccess, statAvgFit, statMaxFit, statTotalSuccess;
let modalOverlay;

function setupDashboard() {
    let mainContainer = select('#main-container');
    let oldDash = select('.dashboard');
    if (oldDash) oldDash.remove();

    let dashboard = createDiv('').class('dashboard').parent(mainContainer);

    // --- Kolom 1 (Info) ---
    let box1 = createDiv('<h4>Generation Info</h4>').class('stat-box').parent(dashboard);
    statGen = createDiv('Gen: 1').class('val').parent(box1);
    statCycles = createDiv('Time: 0').class('val').style('font-size', '14px').style('color', '#ddd').parent(box1);

    // --- Kolom 2 (Success) ---
    let box2 = createDiv('<h4>Success Rate</h4>').class('stat-box').parent(dashboard);
    statSuccess = createDiv('0%').class('val').style('font-size', '24px').parent(box2);
    statAvgFit = createDiv('Avg Fit: 0').class('sub-val').parent(box2);

    // --- Kolom 3 (Records) ---
    let box3 = createDiv('<h4>Records</h4>').class('stat-box').parent(dashboard);
    statMaxFit = createDiv('Max Fit: 0').class('sub-val').parent(box3);
    createDiv('Total Completed').style('font-size', '10px').style('color', '#aaa').style('margin-top', '5px').parent(box3);
    statTotalSuccess = createDiv('0').class('val').style('color', '#3498db').parent(box3);

    // --- CONTROLS ROW ---
    let controlBox = createDiv('').class('control-box').parent(dashboard);

    // 1. Input Populasi (Hanya Input Angka)
    let groupPop = createDiv('<label>Populasi</label>').class('input-group').parent(controlBox);
    popSizeInput = createInput('100', 'number').parent(groupPop);
    popSizeInput.attribute('min', '10');
    // Slider dihapus

    // 2. Input Lifespan (Hanya Input Angka)
    let groupLife = createDiv('<label>Lifespan</label>').class('input-group').parent(controlBox);
    lifespanInput = createInput('400', 'number').parent(groupLife);
    lifespanInput.attribute('min', '100');
    // Slider dihapus

    // 3. Input Mutation Rate (Hanya Input Angka)
    let groupMut = createDiv('<label>Mutation Rate</label>').class('input-group').parent(controlBox);
    mutationInput = createInput('0.01', 'number').parent(groupMut);
    mutationInput.attribute('step', '0.01'); // Penting agar bisa desimal
    mutationInput.attribute('min', '0');
    mutationInput.attribute('max', '1');
    // Slider dihapus

    // 4. Dropdown Kesulitan
    let groupDiff = createDiv('<label>Rintangan</label>').class('input-group').parent(controlBox);
    difficultySel = createSelect().parent(groupDiff);
    difficultySel.option('Tanpa Rintangan', 'none');
    difficultySel.option('Simple', 'simple');
    difficultySel.option('Hard', 'hard');
    difficultySel.option('Random Blocks', 'random');
    difficultySel.selected('hard');

    // 5. Tombol Restart
    restartBtn = createButton('APPLY & RESTART').parent(controlBox);
    restartBtn.mousePressed(startSimulation);

    setupModal();
}

// --- Helper Functions (Tidak Berubah) ---
function setupModal() {
    modalOverlay = createDiv('').class('modal-overlay').parent(document.body);
    let box = createDiv('').class('modal-box').parent(modalOverlay);
    createElement('h2', 'MISSION ACCOMPLISHED').parent(box);
    createDiv('Populasi berhasil mencapai target 100%').style('color', '#aaa').style('margin-bottom', '20px').parent(box);
    let statsContainer = createDiv('').id('modal-stats').parent(box);
    let btn = createButton('MAIN LAGI').class('modal-btn').parent(box);
    btn.mousePressed(() => {
        modalOverlay.style('display', 'none');
        startSimulation();
        loop();
    });
}

function showVictory() {
    let container = select('#modal-stats');
    container.html('');
    const addRow = (label, value) => {
        let row = createDiv('').class('stat-row').parent(container);
        createSpan(label).style('color', '#ddd').parent(row);
        createSpan(value).style('font-weight', 'bold').parent(row);
    };
    addRow('Generasi Diperlukan', generationCount);
    addRow('Populasi', popSizeInput.value());
    addRow('Max Fitness', population.stats.maxFit.toFixed(4));
    addRow('Rata-rata Fitness', population.stats.avgFit.toFixed(4));
    modalOverlay.style('display', 'flex');
}

function updateStatsUI() {
    statGen.html(`GEN: ${generationCount}`);
    statCycles.html(`Time: ${lifespan - lifeCounter}`);
    if (population && population.stats) {
        statSuccess.html(`${population.stats.successRate.toFixed(1)}%`);
        statAvgFit.html(`Avg Fitness: ${population.stats.avgFit.toFixed(2)}`);
        statMaxFit.html(`Max Fit: ${population.stats.maxFit.toFixed(2)}`);
        statTotalSuccess.html(totalCompletedFireflys);
        if (population.stats.successRate > 50) statSuccess.style('color', '#2ecc71');
        else statSuccess.style('color', '#e74c3c');
    }
}