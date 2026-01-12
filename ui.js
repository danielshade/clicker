/**
 * UI.JS - Інтерфейс, Крамниця Русалки та Сюжетні Діалоги
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
            <p style="margin-top:20px; color:gold; font-weight:bold;">⚪ ${playerProgress.pearls} ${T.pearls}</p>
        </div>
    `;
}

// --- 2. ВИБІР МАПИ ТА ДІАЛОГ БЛЕРВУДА ---
function showMaps() {
    const T = TRANSLATIONS[gameState.lang];
    let html = `<h2>${T.maps}</h2>`;
    
    MAP_DATA.forEach(map => {
        // Мапа 5 (id:4) заблокована, поки не пройдено 4 мапи
        const isLocked = map.id === 4 && playerProgress.completedMaps.length < 4;
        
        html += `
            <button class="btn-blue" style="width:100%; opacity: ${isLocked ? 0.5 : 1}" 
                onclick="${isLocked ? `alert('${gameState.lang === 'uk' ? 'Пройдіть перші 4 мапи!' : 'Complete the first 4 maps!'}')` : `selectMap(${map.id})`}">
                ${isLocked ? "🔒 " : ""}${map.name}
            </button>`;
    });

    html += `<button class="btn-blue" style="background:#444; width:100%" onclick="showMain()">${T.back}</button>`;
    renderer.innerHTML = `<div class="menu-container">${html}</div>`;
}

function selectMap(id) {
    gameState.mapId = id;
    gameState.stageIdx = 0;
    // Сюжетний діалог для 5-ї мапи
    if (id === 4) showBlairwoodDialogue(); 
    else showDifficulty();
}

function showBlairwoodDialogue() {
    const isUK = gameState.lang === 'uk';
    renderer.innerHTML = `
        <div class="menu-container" style="width:500px;">
            <h2 style="color:gold;">${isUK ? 'Блервуд: Місто Спогадів' : 'Blairwood: City of Memories'}</h2>
            <div style="text-align:left; background:rgba(0,0,0,0.5); padding:15px; border-radius:10px; font-size:15px; line-height:1.4;">
                <p><b>${isUK ? 'Стенлі' : 'Stanley'}:</b> ${isUK ? 'Це місто виглядає мертвим. Чому ми тут?' : 'This city looks dead. Why are we here?'}</p>
                <p><b>${isUK ? 'Мер' : 'Mayor'}:</b> ${isUK ? 'Стенлі, підводний народ забирає наших дітей. Вони приходять з туману. Допоможіть нам розслідувати це лихо...' : 'Stanley, the undersea folk are taking our children. They come from the mist. Help us investigate this tragedy...'}</p>
            </div>
            <button class="btn-blue" style="width:100%; margin-top:15px;" onclick="showDifficulty()">
                ${isUK ? 'ПРИЙНЯТИ ЗАВДАННЯ' : 'ACCEPT TASK'}
            </button>
        </div>
    `;
}

// --- 3. СКЛАДНІСТЬ ТА ВИБІР ЗБРОЇ ---
function setDiff(d) {
    gameState.difficulty = d;
    showWeaponSelection();
}

function showWeaponSelection() {
    const isUK = gameState.lang === 'uk';
    const hasMachete = playerProgress.boughtWeapons.includes('machete');
    
    renderer.innerHTML = `
        <div class="menu-container">
            <h2>${isUK ? 'ОБЕРІТЬ ЗБРОЮ' : 'SELECT WEAPON'}</h2>
            <button class="btn-blue" style="width:100%" onclick="setWeapon('none')">${isUK ? 'БЕЗ ЗБРОЇ' : 'NO WEAPON'}</button>
            ${hasMachete ? 
                `<button class="btn-blue" style="width:100%" onclick="setWeapon('machete')">${isUK ? 'МАЧЕТА' : 'MACHETE'}</button>` : 
                `<button class="btn-blue" style="width:100%; opacity:0.5;" onclick="alert('${isUK ? 'Купіть Мачету в крамниці!' : 'Buy Machete in the shop!'}')">
                    ${isUK ? 'МАЧЕТА (ЗАБЛОКОВАНО)' : 'MACHETE (LOCKED)'}
                </button>`
            }
            <button class="btn-blue" style="background:#444; width:100%" onclick="showDifficulty()">${TRANSLATIONS[gameState.lang].back}</button>
        </div>
    `;
}

function setWeapon(w) {
    gameState.weapon = w;
    startGame();
}

// --- 4. КРАМНИЦЯ РУСАЛКИ ---
function showShop() {
    const T = TRANSLATIONS[gameState.lang];
    if (!playerProgress.shopUnlocked) {
        alert(gameState.lang === 'uk' ? "Крамниця закрита! Переможіть Кракена на НОРМАЛЬНІЙ складності." : "Shop locked! Defeat Kraken on NORMAL.");
        return;
    }

    renderer.innerHTML = `
        <div class="menu-container shop-bg">
            <h2 style="color:var(--gold)">${T.shop}</h2>
            <div class="mermaid-seller">
                <img src="assets/mermaid.png" style="width: 140px; border-bottom: 2px solid var(--gold);">
                <p style="font-style: italic; font-size: 14px; margin: 10px 0;">
                    ${gameState.lang === 'uk' ? "Вітаю, мисливцю. Що тебе цікавить?" : "Welcome, hunter. What do you seek?"}
                </p>
            </div>
            <div class="scroll-list">
                <p><b>${T.goods}</b></p>
                ${SHOP_ITEMS.map(item => {
                    const isBought = item.id === 'machete' && playerProgress.boughtWeapons.includes('machete');
                    return `
                    <div class="list-item" style="display:flex; justify-content:space-between; align-items:center;">
                        <span>${item.name}<br><small>${item.desc}</small></span>
                        <button class="btn-small" ${isBought ? 'disabled style="opacity:0.5"' : `onclick="buyItem('${item.id}', ${item.price})"`}>
                            ${isBought ? '✓' : `${item.price} ⚪`}
                        </button>
                    </div>`;
                }).join('')}
                
                <p style="margin-top:15px;"><b>${T.loot}</b></p>
                ${playerProgress.inventory.length === 0 ? `<p><small>Порожньо</small></p>` : ""}
                ${playerProgress.inventory.map((key, index) => `
                    <div class="list-item" style="display:flex; justify-content:space-between; align-items:center;">
                        <span>${LEGENDARY_ITEMS[key].name}</span>
                        <button class="btn-small" style="background: #2ecc71; color: white;" onclick="sellItem(${index}, '${key}')">
                            +${LEGENDARY_ITEMS[key].price} ⚪
                        </button>
                    </div>`).join('')}
            </div>
            <p style="color:gold; font-weight:bold;">⚪ ${playerProgress.pearls} ${T.pearls}</p>
            <button class="btn-blue" style="width:100%" onclick="showMain()">${T.back}</button>
        </div>
    `;
}

function buyItem(id, price) {
    if (playerProgress.pearls < price) {
        alert(gameState.lang === 'uk' ? "Недостатньо перлин!" : "Not enough pearls!");
        return;
    }
    playerProgress.pearls -= price;
    if (id === 'scroll_about') showScrollChoice();
    else if (id === 'machete') {
        playerProgress.boughtWeapons.push('machete');
        alert(gameState.lang === 'uk' ? "Мачета куплена!" : "Machete purchased!");
    }
    saveGame();
    showShop();
}

function sellItem(index, key) {
    playerProgress.pearls += LEGENDARY_ITEMS[key].price;
    playerProgress.inventory.splice(index, 1);
    saveGame();
    showShop();
}

// --- 5. СВИТКИ ТА ЛЕГЕНДИ ---
function showScrollChoice() {
    const isUK = gameState.lang === 'uk';
    renderer.innerHTML = `
        <div class="menu-container scroll-visual">
            <h2>${isUK ? 'Оберіть таємницю' : 'Choose a Mystery'}</h2>
            <div class="button-grid" style="display:flex; flex-direction:column;">
                <button class="btn-blue" onclick="showLegendContent('oceans_curse')">${isUK ? 'Прокляття Океанів' : 'Curse of Oceans'}</button>
                <button class="btn-blue" onclick="showLegendContent('guardian_legend')">${isUK ? 'Страж Лагуни' : 'Guardian Legend'}</button>
                <button class="btn-blue" onclick="showLegendContent('god_abyss')">${isUK ? 'Бог Безодні' : 'God of Abyss'}</button>
                <button class="btn-blue" style="background:#444" onclick="showShop()">${TRANSLATIONS[gameState.lang].back}</button>
            </div>
        </div>
    `;
}

function showLegendContent(key) {
    const legend = LEGENDS_TEXT[gameState.lang][key];
    renderer.innerHTML = `
        <div class="menu-container scroll-visual" style="width: 500px;">
            <h2 style="color:var(--gold); border-bottom: 1px solid var(--gold); padding-bottom: 10px;">${legend.title}</h2>
            <div class="scroll-list" style="text-align: justify; font-size: 15px; line-height: 1.6;">
                <p>${legend.text.replace(/\n/g, '<br>')}</p>
            </div>
            <button class="btn-blue" style="width:100%" onclick="showScrollChoice()">${gameState.lang === 'uk' ? 'НАЗАД' : 'BACK'}</button>
        </div>
    `;
}

// --- 6. БЕСТІАРІЙ ТА ГЕРОЇ (стандартні) ---
function showBestiary() {
    const T = TRANSLATIONS[gameState.lang];
    let html = `<h2>${T.bestiary}</h2><div class="scroll-list">`;
    for (let catKey in BESTIARY_CATEGORIES) {
        const categoryLabel = BESTIARY_CATEGORIES[catKey][gameState.lang];
        const categoryItems = BESTIARY_DATA.filter(item => item.category === catKey);
        if (categoryItems.length > 0) {
            html += `<h3 class="category-header" style="text-align:left; color:gold; border-bottom:1px solid gold;">${categoryLabel}</h3>`;
            categoryItems.forEach(m => {
                html += `
                <div class="list-item bestiary-card" style="display:flex; align-items:center; gap:10px;">
                    <img src="${m.img}" style="width:50px;">
                    <div><b>${m.name}</b><br><small>${m.desc}</small></div>
                </div>`;
            });
        }
    }
    html += `</div><button class="btn-blue" style="width:100%" onclick="showMain()">${T.back}</button>`;
    renderer.innerHTML = `<div class="menu-container">${html}</div>`;
}

function showChars() {
    const T = TRANSLATIONS[gameState.lang];
    let html = `<h2>${T.chars}</h2><div class="scroll-list">`;
    CHARACTER_DATA.forEach(char => {
        const isUnlocked = char.unlocked || playerProgress.unlockedChars.includes(char.id);
        html += `
            <div class="list-item char-card ${!isUnlocked ? 'locked-char' : ''}" style="border:1px solid gold; margin-bottom:10px; padding:10px;">
                <div style="display:flex; gap:15px;">
                    <img src="${char.img}" style="width:80px; border:1px solid gold;">
                    <div style="text-align:left;">
                        <b style="color:gold;">${char.name[gameState.lang]}</b><br>
                        <small><b>${T.age}:</b> ${char.stats.age[gameState.lang]}</small><br>
                        <small><b>${T.race}:</b> ${char.stats.race[gameState.lang]}</small>
                    </div>
                </div>
                <p style="text-align:left; font-size:12px;">${char.stats.bio[gameState.lang]}</p>
            </div>`;
    });
    html += `</div><button class="btn-blue" style="width:100%" onclick="showMain()">${T.back}</button>`;
    renderer.innerHTML = `<div class="menu-container">${html}</div>`;
}

// --- 7. ПЕРЕМОГА ---
function showVictoryScreen() {
    const T = TRANSLATIONS[gameState.lang];
    renderer.classList.remove('hidden');
    const hasNext = gameState.stageIdx < 2;
    renderer.innerHTML = `
        <div class="menu-container">
            <h1 style="color:gold;">${T.victory}</h1>
            <p style="margin-bottom:20px;">⚪ +${gameState.difficulty === 'jaws' ? 15 : 5} ${T.pearls}</p>
            <button class="btn-blue" style="width:100%" onclick="${hasNext ? 'nextStage()' : 'location.reload()'}">
                ${hasNext ? T.next : T.finish}
            </button>
        </div>
    `;
}

function nextStage() { gameState.stageIdx++; startGame(); }

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

showMain();