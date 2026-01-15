// Variabel UI Global (agar bisa diakses sketch.js)
let popSizeInput, popSizeSlider;
let lifespanInput, lifespanSlider;
let difficultySel;
let restartBtn;
let statGen, statCycles, statSuccess, statAvgFit, statMaxFit, statTotalSuccess;

function setupDashboard() {
    let mainContainer = select('#main-container');
    // Hapus dashboard lama jika ada (mencegah duplikasi saat reload hot-swap)
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

    // 1. Input Populasi
    let groupPop = createDiv('<label>Populasi</label>').class('input-group').parent(controlBox);
    let rowPop = createDiv('').style('display:flex; gap:5px;').parent(groupPop);
    popSizeInput = createInput('100', 'number').parent(rowPop);
    popSizeInput.attribute('min', '10');
    popSizeSlider = createSlider(10, 500, 100, 10).parent(rowPop);

    popSizeSlider.input(() => popSizeInput.value(popSizeSlider.value()));
    popSizeInput.input(() => popSizeSlider.value(popSizeInput.value()));

    // 2. Input Lifespan (BARU)
    let groupLife = createDiv('<label>Lifespan (Durasi)</label>').class('input-group').parent(controlBox);
    let rowLife = createDiv('').style('display:flex; gap:5px;').parent(groupLife);
    // Default 400, Range 100 - 1000
    lifespanInput = createInput('400', 'number').parent(rowLife);
    lifespanInput.attribute('min', '100');
    lifespanSlider = createSlider(100, 800, 400, 50).parent(rowLife);

    lifespanSlider.input(() => lifespanInput.value(lifespanSlider.value()));
    lifespanInput.input(() => lifespanSlider.value(lifespanInput.value()));

    // 3. Dropdown Kesulitan
    let groupDiff = createDiv('<label>Rintangan</label>').class('input-group').parent(controlBox);
    difficultySel = createSelect().parent(groupDiff);
    difficultySel.option('Tanpa Rintangan', 'none');
    difficultySel.option('Simple (1 Tembok)', 'simple');
    difficultySel.option('Hard (Labirin)', 'hard');
    difficultySel.option('Random Blocks', 'random'); // <--- OPSI BARU
    difficultySel.selected('hard');

    // 4. Tombol Restart
    restartBtn = createButton('APPLY & RESTART').parent(controlBox);
    restartBtn.mousePressed(startSimulation);
}

function updateStatsUI() {
    statGen.html(`GEN: ${generationCount}`);
    statCycles.html(`Time: ${lifespan - lifeCounter}`); // Gunakan variabel global lifespan

    if (population && population.stats) {
        statSuccess.html(`${population.stats.successRate.toFixed(1)}%`);
        statAvgFit.html(`Avg Fitness: ${population.stats.avgFit.toFixed(2)}`);
        statMaxFit.html(`Max Fit: ${population.stats.maxFit.toFixed(2)}`);
        statTotalSuccess.html(totalCompletedFireflys);

        if (population.stats.successRate > 50) statSuccess.style('color', '#2ecc71');
        else statSuccess.style('color', '#e74c3c');
    }
}