// Variabel UI Global (agar bisa diakses sketch.js)
let popSizeInput, popSizeSlider;
let difficultySel;
let restartBtn;
let statGen, statCycles, statSuccess, statAvgFit, statMaxFit, statTotalSuccess;

function setupDashboard() {
    // Ambil container dari index.html
    let mainContainer = select('#main-container');
    let dashboard = createDiv('').class('dashboard').parent(mainContainer);

    // --- Kolom 1 ---
    let box1 = createDiv('<h4>Generation Info</h4>').class('stat-box').parent(dashboard);
    statGen = createDiv('Gen: 1').class('val').parent(box1);
    statCycles = createDiv('Time: 0').class('val').style('font-size', '14px').style('color', '#ddd').parent(box1);

    // --- Kolom 2 ---
    let box2 = createDiv('<h4>Success Rate</h4>').class('stat-box').parent(dashboard);
    statSuccess = createDiv('0%').class('val').style('font-size', '24px').parent(box2);
    statAvgFit = createDiv('Avg Fit: 0').class('sub-val').parent(box2);

    // --- Kolom 3 ---
    let box3 = createDiv('<h4>Records</h4>').class('stat-box').parent(dashboard);
    statMaxFit = createDiv('Max Fit: 0').class('sub-val').parent(box3);
    createDiv('Total Completed').style('font-size', '10px').style('color', '#aaa').style('margin-top', '5px').parent(box3);
    statTotalSuccess = createDiv('0').class('val').style('color', '#3498db').parent(box3);

    // --- CONTROLS ---
    let controlBox = createDiv('').class('control-box').parent(dashboard);

    // Input Populasi
    let groupPop = createDiv('<label>Populasi</label>').class('input-group').parent(controlBox);
    let rowPop = createDiv('').style('display:flex; gap:5px;').parent(groupPop);
    popSizeInput = createInput('100', 'number').parent(rowPop);
    popSizeInput.attribute('min', '10');
    popSizeSlider = createSlider(10, 500, 100, 10).parent(rowPop);

    // Sinkronisasi Input
    popSizeSlider.input(() => popSizeInput.value(popSizeSlider.value()));
    popSizeInput.input(() => popSizeSlider.value(popSizeInput.value()));

    // Dropdown Kesulitan
    let groupDiff = createDiv('<label>Tingkat Kesulitan</label>').class('input-group').parent(controlBox);
    difficultySel = createSelect().parent(groupDiff);
    difficultySel.option('Tanpa Rintangan', 'none');
    difficultySel.option('Rintangan Simple', 'simple');
    difficultySel.option('Rintangan Sulit (Labirin)', 'hard');
    difficultySel.selected('hard');

    // Tombol Restart
    restartBtn = createButton('TERAPKAN & ULANG').parent(controlBox);
    restartBtn.mousePressed(startSimulation); // startSimulation ada di sketch.js
}

function updateStatsUI() {
    statGen.html(`GEN: ${generationCount}`);
    statCycles.html(`Cycles: ${lifespan - lifeCounter}`);

    // Pastikan population sudah ada isinya
    if (population && population.stats) {
        statSuccess.html(`${population.stats.successRate.toFixed(1)}%`);
        statAvgFit.html(`Avg Fitness: ${population.stats.avgFit.toFixed(2)}`);
        statMaxFit.html(`Max Fit: ${population.stats.maxFit.toFixed(2)}`);
        statTotalSuccess.html(totalCompletedFireflys);

        if (population.stats.successRate > 50) statSuccess.style('color', '#2ecc71');
        else statSuccess.style('color', '#e74c3c');
    }
}