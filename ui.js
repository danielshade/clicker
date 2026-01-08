/**
 * UI.JS - Інтерфейс, Крамниця Русалки та Навігація
 */

const renderer = document.getElementById('screen-renderer');

// --- 1. ГОЛОВНЕ МЕНЮ ТА МОВА ---
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
            <p style="margin-top:20px; color:gold;">⚪ ${playerProgress.pearls} ${T.pearls}</p>
        </div>
    `;
}

// --- 2. ВИБІР МАПИ ТА СКЛАДНОСТІ ---
function showMaps() {
    const T = TRANSLATIONS[gameState.lang];
    let html = `<h2>${T.maps}</h2>`;
    MAP_DATA.forEach(map => {
        html += `<button class="btn-blue" style="width:100%" onclick="selectMap(${map.id})">${map.name}</button>`;
    });
    html += `<button class="btn-blue" style="background:#444; width:100%" onclick="showMain()">${T.back}</button>`;
    renderer.innerHTML = `<div class="menu-container">${html}</div>`;
}

function selectMap(id) { 
    gameState.mapId = id; 
    gameState.stageIdx = 0; 
    showDifficulty(); 
}

function showDifficulty() {
    const T = TRANSLATIONS[gameState.lang];
    renderer.innerHTML = `
        <div class="menu-container">
            <h2>${T.diff}</h2>
            <button class="btn-blue" style="width:100%" onclick="setDiff('easy')">${T.easy}</button>
            <button class="btn-blue" style="width:100%" onclick="setDiff('normal')">${T.normal}</button>
            <button class="btn-blue" style="width:100%" onclick="setDiff('jaws')">${T.jaws}</button>
            <button class="btn-blue" style="background:#444; width:100%" onclick="showMaps()">${T.back}</button>
        </div>
    `;
}

function setDiff(d) { 
    gameState.difficulty = d; 
    startGame(); 
}

// --- 3. ПЕРСОНАЖІ ТА БЕСТІАРІЙ ---
function showChars() {
    const T = TRANSLATIONS[gameState.lang];
    renderer.innerHTML = `
        <div class="menu-container">
            <img src="assets/stanley.png" style="width:120px; border-radius:10px; border:2px solid gold; margin-bottom:10px;">
            <h2>СТАНЛІ</h2>
            <p>${gameState.lang === 'uk' ? 'Хоробрий капітан, що кинув виклик безодні.' : 'A brave captain who challenged the abyss.'}</p>
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

// --- 4. КРАМНИЦЯ РУСАЛКИ ---
function showShop() {
    const T = TRANSLATIONS[gameState.lang];
    
    // Перевірка розблокування (id:1 — Окови Безодні)
    if (!playerProgress.shopUnlocked) {
        alert(gameState.lang === 'uk' ? 
            "Крамниця закрита! Переможіть Кракена на НОРМАЛЬНІЙ складності." : 
            "Shop locked! Defeat Kraken on NORMAL difficulty.");
        return;
    }

    renderer.innerHTML = `
        <div class="menu-container shop-bg">
            <h2 style="color:var(--gold)">${T.shop}</h2>
            
            <div class="mermaid-seller">
                <img src="assets/mermaid.png" style="width: 150px; border-bottom: 2px solid var(--gold);">
                <p style="font-style: italic; font-size: 14px; margin: 10px 0;">
                    ${gameState.lang === 'uk' ? "Вітаю, мисливцю. Що тебе цікавить?" : "Welcome, hunter. What do you seek?"}
                </p>
            </div>

            <div class="scroll-list">
                <div style="border-bottom: 1px solid var(--gold); padding-bottom:10px;">
                    <p><b>${T.goods}</b></p>
                    ${SHOP_ITEMS.map(item => `
                        <div class="list-item" style="display:flex; justify-content:space-between; align-items:center;">
                            <span>${item.name}<br><small>${item.desc}</small></span>
                            <button class="btn-small" onclick="buyItem('${item.id}', ${item.price})">${item.price} ⚪</button>
                        </div>
                    `).join('')}
                </div>

                <div style="margin-top:15px;">
                    <p><b>${T.loot}</b></p>
                    ${playerProgress.inventory.length === 0 ? `<p><small>${gameState.lang === 'uk' ? 'Порожньо' : 'Empty'}</small></p>` : ""}
                    ${playerProgress.inventory.map((key, index) => `
                        <div class="list-item" style="display:flex; justify-content:space-between; align-items:center;">
                            <span>${LEGENDARY_ITEMS[key].name}</span>
                            <button class="btn-small" style="background: #2ecc71; color: white;" onclick="sellItem(${index}, '${key}')">10 ⚪</button>
                        </div>
                    `).join('')}
                </div>
            </div>

            <p style="color:gold; font-weight:bold;">⚪ ${playerProgress.pearls} ${T.pearls}</p>
            <button class="btn-blue" style="width:100%" onclick="showMain()">${T.back}</button>
        </div>
    `;
}

// ЛОГІКА КРАМНИЦІ
function sellItem(index, key) {
    playerProgress.pearls += LEGENDARY_ITEMS[key].price;
    playerProgress.inventory.splice(index, 1);
    saveGame();
    showShop();
}

function buyItem(id, price) {
    if (playerProgress.pearls < price) {
        alert(gameState.lang === 'uk' ? "Недостатньо перлин!" : "Not enough pearls!");
        return;
    }

    if (id === 'scroll_about') {
        playerProgress.pearls -= price;
        saveGame();
        showScrollChoice();
    } else {
        alert(gameState.lang === 'uk' ? "Цей предмет поки недоступний!" : "Item coming soon!");
    }
}

function showScrollChoice() {
    const T = TRANSLATIONS[gameState.lang];
    renderer.innerHTML = `
        <div class="menu-container">
            <h2 style="color:var(--gold)">${gameState.lang === 'uk' ? 'Свиток про...' : 'Scroll about...'}</h2>
            <div style="display:flex; flex-direction:column; gap:10px;">
                <button class="btn-blue" onclick="alert('${gameState.lang === 'uk' ? 'Ви дізналися таємниці Мегалодона!' : 'Secrets of Megalodon revealed!'}'); showShop();">${gameState.lang === 'uk' ? 'Секрети Глибини' : 'Deep Secrets'}</button>
                <button class="btn-blue" onclick="alert('${gameState.lang === 'uk' ? 'Ви дізналися історію Генрі Клауда!' : 'Henry Cloud\'s story revealed!'}'); showShop();">${gameState.lang === 'uk' ? 'Генрі Клауд' : 'Henry Cloud'}</button>
                <button class="btn-blue" style="background:#444" onclick="showShop()">${T.back}</button>
            </div>
        </div>
    `;
}

// --- 5. ПЕРЕМОГА ТА ПЕРЕХІД ---
function showVictoryScreen() {
    const T = TRANSLATIONS[gameState.lang];
    renderer.classList.remove('hidden');
    const hasNext = gameState.stageIdx < 2; 
    renderer.innerHTML = `
        <div class="menu-container">
            <h1 style="color:gold; text-shadow: 0 0 15px gold;">${T.victory}</h1>
            <p style="margin-bottom:20px;">⚪ +${gameState.difficulty === 'jaws' ? 15 : 5} ${T.pearls}</p>
            <button class="btn-blue" style="width:100%" onclick="${hasNext ? 'nextStage()' : 'location.reload()'}">
                ${hasNext ? T.next : T.finish}
            </button>
        </div>
    `;
}

function nextStage() { 
    gameState.stageIdx++; 
    startGame(); 
}

// Ініціалізація
showMain();