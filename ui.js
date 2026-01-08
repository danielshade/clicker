/**
 * UI.JS
 */

const renderer = document.getElementById('screen-renderer');

function toggleLang() {
    gameState.lang = gameState.lang === 'uk' ? 'en' : 'uk';
    showMain();
}

function showMain() {
    const T = TRANSLATIONS[gameState.lang];
    renderer.classList.remove('hidden');
    renderer.innerHTML = `
        <div class="menu-container">
            <button class="lang-switch" onclick="toggleLang()">UK / EN</button>
            <h1 class="game-title">${T.title}</h1>
            <div class="button-grid">
                <button class="btn-blue" onclick="showMaps()">${T.maps}</button>
                <button class="btn-blue" onclick="showChars()">${T.chars}</button>
                <button class="btn-blue" onclick="showShop()">${T.shop}</button>
                <button class="btn-blue" onclick="showBestiary()">${T.bestiary}</button>
            </div>
        </div>
    `;
}

function showMaps() {
    const T = TRANSLATIONS[gameState.lang];
    let html = `<h2>${T.maps}</h2>`;
    MAP_DATA.forEach(map => {
        html += `<button class="btn-blue" style="width:100%" onclick="selectMap(${map.id})">${map.name}</button>`;
    });
    html += `<button class="btn-blue" style="background:#444; width:100%" onclick="showMain()">${T.back}</button>`;
    renderer.innerHTML = `<div class="menu-container">${html}</div>`;
}

function selectMap(id) { gameState.mapId = id; gameState.stageIdx = 0; showDifficulty(); }

function showDifficulty() {
    const T = TRANSLATIONS[gameState.lang];
    renderer.innerHTML = `
        <div class="menu-container">
            <h2>${T.diff}</h2>
            <button class="btn-blue" style="width:100%" onclick="setDiff('easy')">${T.easy}</button>
            <button class="btn-blue" style="width:100%" onclick="setDiff('normal')">${T.normal}</button>
            <button class="btn-blue" style="width:100%" onclick="setDiff('jaws')">${T.jaws}</button>
        </div>
    `;
}

function setDiff(d) { gameState.difficulty = d; startGame(); }

function showChars() {
    const T = TRANSLATIONS[gameState.lang];
    renderer.innerHTML = `
        <div class="menu-container">
            <img src="assets/stanley.png" style="width:120px; border-radius:10px; border:2px solid gold;">
            <h2>СТАНЛІ</h2>
            <p>Хоробрий капітан.</p>
            <button class="btn-blue" style="width:100%" onclick="showMain()">${T.back}</button>
        </div>
    `;
}

function showBestiary() {
    const T = TRANSLATIONS[gameState.lang];
    let html = `<h2>${T.bestiary}</h2><div class="scroll-list">`;
    BESTIARY_DATA.forEach(m => {
        html += `<div class="list-item"><b>${m.name}</b><br><small>${m.desc}</small></div>`;
    });
    html += `</div><button class="btn-blue" style="width:100%" onclick="showMain()">${T.back}</button>`;
    renderer.innerHTML = `<div class="menu-container">${html}</div>`;
}

function showShop() {
    const T = TRANSLATIONS[gameState.lang];
    renderer.innerHTML = `<div class="menu-container"><h2>${T.shop}</h2><p>Скоро...</p><button class="btn-blue" style="width:100%" onclick="showMain()">${T.back}</button></div>`;
}

function showVictoryScreen() {
    const T = TRANSLATIONS[gameState.lang];
    renderer.classList.remove('hidden');
    const hasNext = gameState.stageIdx < 2; 
    renderer.innerHTML = `<div class="menu-container"><h1 style="color:gold">${T.victory}</h1><button class="btn-blue" style="width:100%" onclick="${hasNext ? 'nextStage()' : 'location.reload()'}">${hasNext ? T.next : T.finish}</button></div>`;
}

function nextStage() { gameState.stageIdx++; startGame(); }

showMain();