/**
 * UI.JS - Оновлення 6.5: Жосткий Апгрейд (Фінальна збірка)
 * Світ, Бестіарій, Лавкрафт-герої, Лор та Гача
 */

const renderer = document.getElementById('screen-renderer');

// --- 1. БЕЗПЕЧНА ІНІЦІАЛІЗАЦІЯ ---
const initProgress = () => {
    const defaults = {
        achievements: [],
        seenStory: [],
        killedBosses: [],
        inventory: [],
        boughtWeapons: ['none'],
        boughtItems: [], 
        pearls: 0,
        blackSand: 0,
        unlockedChars: [1],
        completedMaps: [],
        shopUnlocked: false
    };
    
    Object.keys(defaults).forEach(key => {
        if (playerProgress[key] === undefined) {
            playerProgress[key] = defaults[key];
        }
    });
};

initProgress();

// --- 2. ГОЛОВНЕ МЕНЮ ---
function toggleLang() {
    gameState.lang = gameState.lang === 'uk' ? 'en' : 'uk';
    showMain();
}

function showMain() {
    const T = TRANSLATIONS[gameState.lang];
    renderer.classList.remove('hidden');
    document.body.classList.add('menu-active');
    
    renderer.innerHTML = `
        <div class="menu-container main-menu-bg" style="background: rgba(0, 10, 25, 0.9); backdrop-filter: blur(15px); border: 1px solid rgba(255,215,0,0.3);">
            <button class="lang-switch" onclick="toggleLang()">🌐 ${gameState.lang.toUpperCase()}</button>
            <h1 class="game-title" style="text-shadow: 0 0 20px var(--gold);">${T.title}</h1>
            
            <div class="button-grid">
                <button class="btn-blue" onclick="showMaps()">${T.maps}</button>
                <button class="btn-blue" onclick="showWorld()">${T.world}</button>
                <button class="btn-blue" onclick="showInvitedChars()">${T.invited_chars}</button>
                <button class="btn-blue" onclick="showShop()">${T.shop}</button>
                <button class="btn-blue" onclick="showBestiary()">${T.bestiary}</button>
                <button class="btn-blue" onclick="showChars()">${T.chars}</button>
                <button class="btn-blue" onclick="showInvitations()">${T.invitation}</button>
            </div>

            <div style="margin-top:20px; background: rgba(0,0,0,0.7); padding: 12px; border-radius: 12px; border: 1px solid var(--gold); display: flex; justify-content: space-around;">
                <span style="color:gold; font-weight:bold;">⚪ ${playerProgress.pearls}</span>
                <span style="color:var(--purple); font-weight:bold;">⏳ ${playerProgress.blackSand}</span>
            </div>
            
            ${playerProgress.achievements.includes('SCP') ? 
                `<div style="color:red; margin-top:15px; font-weight:bold; letter-spacing:2px; text-shadow: 0 0 10px red; border: 1px solid red; padding: 5px; border-radius: 5px;">
                    [ STATUS: SCP CONTAINED ]
                </div>` : ''}
        </div>
    `;
}

// --- 3. СЕКЦІЯ "СВІТ" (АТЛАС) ---
function showWorld() {
    const isUK = gameState.lang === 'uk';
    const T = TRANSLATIONS[gameState.lang];
    
    let html = `<h2>${isUK ? 'АТЛАС БЕЗОДНІ' : 'ABYSS ATLAS'}</h2><div class="scroll-list" style="max-height: 400px;">`;
    
    html += `<h3 class="category-header" style="color:var(--gold); text-align:left; border-bottom:1px solid var(--gold);">${isUK ? 'ВІДКРИТІ ЗЕМЛІ' : 'DISCOVERED LANDS'}</h3>`;
    MAP_DATA.forEach(map => {
        const isLocked = map.id > playerProgress.completedMaps.length;
        html += `
            <button class="btn-blue" style="width:100%; margin-bottom:8px; opacity: ${isLocked ? 0.6 : 1}" 
                onclick="${isLocked ? `alert('${T.locked}')` : `selectMap(${map.id})`}">
                ${isLocked ? "🔒 " : "📍 "}${map.name}
            </button>`;
    });

    html += `<h3 class="category-header" style="color:#ff4444; text-align:left; border-bottom:1px solid #ff4444; margin-top:20px;">${isUK ? 'КОШМАРИ МАЙБУТНЬОГО' : 'FUTURE NIGHTMARES'}</h3>`;
    WORLD_REGIONS.forEach(reg => {
        html += `
            <div class="list-item" style="border-color: #440000; background: rgba(50,0,0,0.3); opacity: 0.7; padding: 12px; margin-bottom:8px;">
                <span style="color:#ff4444; font-weight:bold;">🔒 ${reg.name}</span><br>
                <small style="font-style:italic;">${T.locked_region}</small>
            </div>`;
    });

    html += `</div><button class="btn-blue" style="width:100%; margin-top:15px; background:#444;" onclick="showMain()">${T.back}</button>`;
    renderer.innerHTML = `<div class="menu-container" style="width:550px; border-color: #ff4444;">${html}</div>`;
}

// --- 4. МАПИ ТА ДІАЛОГИ ---
function showMaps() {
    const T = TRANSLATIONS[gameState.lang];
    let html = `<h2>${T.maps}</h2><div class="scroll-list" style="max-height: 380px;">`;
    
    MAP_DATA.forEach(map => {
        const isLocked = map.id > playerProgress.completedMaps.length;
        html += `
            <button class="btn-blue" style="width:100%; margin-bottom:10px; opacity: ${isLocked ? 0.5 : 1}" 
                onclick="${isLocked ? `alert('${T.locked}')` : `selectMap(${map.id})`}">
                ${isLocked ? "🔒 " + T.locked : map.name}
            </button>`;
    });
    
    html += `</div><button class="btn-blue" style="background:#444; width:100%" onclick="showMain()">${T.back}</button>`;
    renderer.innerHTML = `<div class="menu-container">${html}</div>`;
}

function selectMap(id) {
    gameState.mapId = id;
    gameState.stageIdx = 0;
    document.body.classList.remove('menu-active');

    const storyTriggers = {
        0: { person: "Стенлі", img: "assets/stanley.png", text: "Мій брат... Мегалодон... помста буде гіркою." },
        1: { person: "Міра", img: "assets/mermaid.png", text: "Безодня кличе моїх сестер. Будь сильним." },
        3: { person: "Елра", img: "assets/elder_woman.png", text: "Туман приніс безумство. Храм Стража впав." }
    };

    if (!playerProgress.seenStory.includes(id) && storyTriggers[id]) {
        return showStoryDialogue(id, storyTriggers[id].person, storyTriggers[id].img, storyTriggers[id].text);
    }
    
    if (id === 4) showBlairwoodDialogue();
    else showDifficulty();
}

function showStoryDialogue(mapId, person, imgPath, text) {
    playerProgress.seenStory.push(mapId);
    saveGame();
    renderer.innerHTML = `
        <div class="menu-container" style="width:600px; padding: 25px; background: rgba(0,0,0,0.85);">
            <div style="display:flex; gap:25px; align-items:center; text-align:left;">
                <img src="${imgPath}" onerror="this.src='assets/ui_bg.png'" style="width:150px; border:3px solid var(--gold); border-radius:15px; box-shadow: 0 0 15px gold;">
                <div style="flex:1;">
                    <h3 style="color:var(--gold); border-bottom:1px solid var(--gold); padding-bottom:5px;">${person}</h3>
                    <p style="font-style:italic; font-size:16px;">"${text}"</p>
                </div>
            </div>
            <button class="btn-blue" style="width:100%; margin-top:25px;" onclick="showDifficulty()">ЗАНУРИТИСЬ</button>
        </div>`;
}

function showBlairwoodDialogue() {
    renderer.innerHTML = `
        <div class="menu-container" style="width:500px;">
            <h2 style="color:gold;">Блервуд: Місто Спогадів</h2>
            <div style="text-align:left; background:rgba(0,0,0,0.5); padding:15px; border-radius:10px;">
                <p><b>Стенлі:</b> Це місто виглядає мертвим. Чому ми тут?</p>
                <p><b>Мер:</b> Підводний народ забирає наших дітей. Допоможіть нам...</p>
            </div>
            <button class="btn-blue" style="width:100%; margin-top:15px;" onclick="showDifficulty()">ПРИЙНЯТИ ЗАВДАННЯ</button>
        </div>`;
}

// --- 5. ГЕРОЇ ТА БЕСТІАРІЙ ---
function showChars() {
    const T = TRANSLATIONS[gameState.lang];
    let html = `<h2>${T.chars}</h2><div class="scroll-list" style="max-height: 480px;">`;
    
    CHARACTER_DATA.forEach(char => {
        const isUnlocked = playerProgress.unlockedChars.includes(char.id);
        html += `
            <div class="list-item char-card ${!isUnlocked ? 'locked-char' : ''}" style="margin-bottom:15px; padding:15px; border: 1px solid var(--gold); position: relative; background: rgba(0,10,30,0.6);">
                <div style="display:flex; gap:20px; align-items: flex-start;">
                    <img src="${char.img}" onerror="this.src='assets/ui_bg.png'" style="width:110px; border:2px solid gold; border-radius:10px;">
                    <div style="text-align: left;">
                        <h3 style="color:gold; margin:0;">${char.name[gameState.lang]}</h3>
                        <p style="margin:5px 0; font-size:13px; color: #aaa;"><b>${T.age}:</b> ${char.stats.age} | <b>${T.race}:</b> ${char.stats.race}</p>
                        <p style="font-size:12px; line-height:1.4; color: #eee; font-style: italic;">${char.stats.bio}</p>
                    </div>
                </div>
                ${!isUnlocked ? `<div class="lock-overlay" style="background: rgba(0,0,0,0.8); position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:22px; font-weight:bold; color:red; border-radius:10px;">🔒 ${T.locked}</div>` : ''}
            </div>`;
    });
    
    html += `</div><button class="btn-blue" style="width:100%; margin-top:10px;" onclick="showMain()">${T.back}</button>`;
    renderer.innerHTML = `<div class="menu-container" style="width:620px;">${html}</div>`;
}

function showBestiary() {
    const T = TRANSLATIONS[gameState.lang];
    let html = `<h2>${T.bestiary}</h2><div class="scroll-list" style="max-height: 450px;">`;
    
    for (let catKey in BESTIARY_CATEGORIES) {
        html += `<h3 class="category-header" style="color:var(--gold); border-bottom:1px solid var(--gold); margin-top:20px; text-align:left; padding-bottom:5px;">
                    ${BESTIARY_CATEGORIES[catKey][gameState.lang]}
                 </h3>`;
        
        BESTIARY_DATA.filter(i => i.category === catKey).forEach(m => {
            html += `
                <div class="list-item" style="display:flex; align-items:center; gap:15px; background:rgba(0,0,0,0.6); border-radius:10px; padding:12px; margin-bottom:10px; border: 1px solid rgba(255,215,0,0.2);">
                    <img src="${m.img}" onerror="this.src='assets/ui_bg.png'" 
                         style="width:70px; height:70px; border:1px solid var(--gold); border-radius:8px; object-fit:cover; background: #000;">
                    <div style="text-align:left;">
                        <b style="color:var(--gold); font-size:17px; letter-spacing:1px;">${m.name}</b><br>
                        <small style="font-style:italic; opacity:0.8; line-height:1.4; display:block; margin-top:4px;">${m.desc}</small>
                    </div>
                </div>`;
        });
    }
    
    html += `</div><button class="btn-blue" style="width:100%; margin-top:10px;" onclick="showMain()">${T.back}</button>`;
    renderer.innerHTML = `<div class="menu-container" style="width:580px;">${html}</div>`;
}

// --- 6. КРАМНИЦЯ ТА ГАЧА ---
function showShop() {
    const T = TRANSLATIONS[gameState.lang];
    if (!playerProgress.shopUnlocked) return alert("Здолайте Кракена на НОРМАЛЬНІЙ складності!");

    renderer.innerHTML = `
        <div class="menu-container shop-bg" style="width:650px; border-color: #2ecc71;">
            <h2>${T.shop}</h2>
            <div class="scroll-list" style="max-height: 350px;">
                <h3 style="color:gold; text-align: left; border-bottom:1px solid gold;">🛒 ${T.goods}</h3>
                ${SHOP_ITEMS.map(item => {
                    const bought = (item.id === 'machete' && playerProgress.boughtWeapons.includes('machete')) ||
                                   (item.id === 'watch' && playerProgress.boughtItems.includes('watch'));
                    return `
                    <div class="list-item" style="display:flex; justify-content:space-between; align-items:center; padding: 12px; background: rgba(255,255,255,0.05); margin-bottom:8px; border-radius:8px;">
                        <span><b>${item.name}</b><br><small style="opacity:0.7;">${item.desc}</small></span>
                        <button class="btn-small" onclick="buyItem('${item.id}', ${item.price})" ${bought ? 'disabled' : ''}>
                            ${bought ? '✓' : `${item.price} ⚪`}
                        </button>
                    </div>`;
                }).join('')}
                <h3 style="color:#2ecc71; text-align: left; border-bottom:1px solid #2ecc71; margin-top:15px;">💎 ${T.loot} (${playerProgress.inventory.length})</h3>
                ${playerProgress.inventory.map((key, index) => `
                    <div class="list-item" style="display:flex; justify-content:space-between; align-items:center;">
                        <span>${LEGENDARY_ITEMS[key].name}</span>
                        <button class="btn-small" style="background:#2ecc71; color:white;" onclick="sellItem(${index}, '${key}')">+${LEGENDARY_ITEMS[key].price} ⚪</button>
                    </div>`).join('')}
            </div>
            <button class="btn-blue" style="width:100%; margin-top:15px;" onclick="showMain()">${T.back}</button>
        </div>`;
}

function buyItem(id, price) {
    if (playerProgress.pearls < price) return alert(gameState.lang === 'uk' ? "Недостатньо перлин!" : "Not enough pearls!");
    playerProgress.pearls -= price;
    if (id === 'machete') playerProgress.boughtWeapons.push('machete');
    else if (id === 'watch') playerProgress.boughtItems.push('watch');
    else if (id === 'scroll_about') return showScrollChoice();
    saveGame();
    showShop();
}

function sellItem(index, key) {
    playerProgress.pearls += LEGENDARY_ITEMS[key].price;
    playerProgress.inventory.splice(index, 1);
    saveGame();
    showShop();
}

function showInvitations() {
    const T = TRANSLATIONS[gameState.lang];
    renderer.innerHTML = `
        <div class="menu-container">
            <h2>${T.invitation}</h2>
            <button class="btn-blue" style="width:100%; margin-bottom:12px;" onclick="rollGacha()">🍀 ПРИКЛИКАТИ ГЕРОЯ</button>
            <div style="padding: 15px; background:rgba(0,0,0,0.6); border-radius: 12px; border: 1px solid var(--gold); text-align:center;">
                <p class="sand-text" style="margin: 0 0 10px 0; font-size: 18px;">⏳ ${playerProgress.blackSand}</p>
                <button class="btn-small" style="width:100%" onclick="exchangeSand()">ОБМІНЯТИ 1 ⏳ НА 5 ⚪</button>
            </div>
            <button class="btn-blue" style="width:100%; margin-top:20px;" onclick="showMain()">${T.back}</button>
        </div>`;
}

function rollGacha() {
    renderer.innerHTML = `<div class="menu-container"><div class="gacha-spinner">⏳</div><p style="color:gold;">${gameState.lang === 'uk' ? 'БЕЗОДНЯ ОБИРАЄ...' : 'THE ABYSS CHOOSES...'}</p></div>`;
    setTimeout(() => {
        const chance = Math.random() * 100;
        if (chance <= 35) {
            const randomChar = CHARACTER_DATA[Math.floor(Math.random() * CHARACTER_DATA.length)];
            if (playerProgress.unlockedChars.includes(randomChar.id)) {
                playerProgress.blackSand += 40; 
                showGachaResult(randomChar.img, `ДУБЛІКАТ: ${randomChar.name[gameState.lang]} (+40 ⏳)`, '#8e44ad');
            } else {
                playerProgress.unlockedChars.push(randomChar.id);
                showGachaResult(randomChar.img, `НОВИЙ ГЕРОЙ: ${randomChar.name[gameState.lang]}`, 'gold');
            }
        } else {
            playerProgress.blackSand += 1;
            showGachaResult(null, gameState.lang === 'uk' ? "Отримано Чорний Пісок!" : "Obtained Black Sand!", '#8e44ad');
        }
        saveGame();
    }, 1200);
}

function showGachaResult(img, text, color) {
    renderer.innerHTML = `<div class="menu-container" style="border:3px solid ${color} !important;">
        ${img ? `<img src="${img}" style="width:150px; border:2px solid gold; border-radius:10px;">` : '<div style="font-size:60px;">⌛</div>'}
        <h3 style="color:${color}; margin:15px 0;">${text}</h3>
        <button class="btn-blue" onclick="showInvitations()">ОК</button>
    </div>`;
}

function exchangeSand() {
    if (playerProgress.blackSand > 0) {
        playerProgress.blackSand--;
        playerProgress.pearls += 5;
        saveGame();
        showInvitations();
    }
}

// --- 7. ЛОР ТА ПАУЗА ---
function showScrollChoice() {
    const isUK = gameState.lang === 'uk';
    const keys = ['megalodon', 'mermaid', 'stanley', 'guardian', 'blairwood', 'asiel_origin'];
    let html = `<h2>${isUK ? 'ТАЄМНИЦІ БЕЗОДНІ' : 'ABYSS MYSTERIES'}</h2><div class="scroll-list">`;
    keys.forEach(key => {
        html += `<button class="btn-blue" style="width:100%; margin-bottom:8px;" onclick="showLegendContent('${key}')">${LEGENDS_TEXT[gameState.lang][key].title}</button>`;
    });
    html += `</div><button class="btn-blue" style="width:100%; background:#444" onclick="showShop()">НАЗАД</button>`;
    renderer.innerHTML = `<div class="menu-container scroll-visual">${html}</div>`;
}

function showLegendContent(key) {
    const legend = LEGENDS_TEXT[gameState.lang][key];
    renderer.innerHTML = `<div class="menu-container scroll-visual" style="width:520px;">
        <h2 style="color: gold;">${legend.title}</h2>
        <div class="scroll-list" style="text-align:justify; font-size: 15px; line-height: 1.6;"><p>${legend.text}</p></div>
        <button class="btn-blue" style="width:100%" onclick="showScrollChoice()">НАЗАД</button></div>`;
}

function togglePause() {
    if (!gameState.active) return;
    gameState.paused = !gameState.paused;
    if (gameState.paused) showPauseMenu();
    else { renderer.classList.add('hidden'); document.body.classList.remove('menu-active'); }
}

function showPauseMenu() {
    const T = TRANSLATIONS[gameState.lang];
    renderer.classList.remove('hidden');
    renderer.innerHTML = `
        <div class="menu-container" style="background: rgba(0,0,0,0.9); border-color: var(--gold);">
            <h2 style="color:var(--gold);">${T.pause}</h2>
            <button class="btn-blue" style="width:100%; margin-bottom:10px;" onclick="togglePause()">${T.resume}</button>
            <button class="btn-blue" style="width:100%; background:#c0392b;" onclick="location.reload()">${T.main_menu}</button>
        </div>`;
}

// --- 8. ГЕЙМПЛЕЙНІ ПЕРЕХОДИ ---
function setDiff(d) { gameState.difficulty = d; showWeaponSelection(); }

function showWeaponSelection() {
    const isUK = gameState.lang === 'uk';
    const hasMachete = playerProgress.boughtWeapons.includes('machete');
    renderer.innerHTML = `
        <div class="menu-container">
            <h2 style="margin-bottom: 20px;">${isUK ? 'ОБЕРІТЬ ЗБРОЮ' : 'SELECT WEAPON'}</h2>
            <button class="btn-blue" style="width:100%; margin-bottom:12px;" onclick="setWeapon('none')">⚓ ${isUK ? 'БЕЗ ЗБРОЇ' : 'NO WEAPON'}</button>
            ${hasMachete ? `<button class="btn-blue" style="width:100%; border-color: #2ecc71;" onclick="setWeapon('machete')">⚔️ МАЧЕТА</button>` : `<button class="btn-blue" style="width:100%; opacity:0.4;" onclick="alert('Купіть у крамниці!')">🔒 МАЧЕТА</button>`}
            <button class="btn-blue" style="background:#444; width:100%; margin-top:20px;" onclick="showDifficulty()">${TRANSLATIONS[gameState.lang].back}</button>
        </div>`;
}

function setWeapon(w) { gameState.weapon = w; startGame(); }

function showDifficulty() {
    const T = TRANSLATIONS[gameState.lang];
    renderer.innerHTML = `<div class="menu-container"><h2>${T.diff}</h2><div style="display:flex; flex-direction:column; gap:12px;"><button class="btn-blue" onclick="setDiff('easy')">${T.easy}</button><button class="btn-blue" onclick="setDiff('normal')">${T.normal}</button><button class="btn-blue" onclick="setDiff('jaws')" style="border-color: red;">${T.jaws}</button></div><button class="btn-blue" style="background:#444; width:100%; margin-top:20px;" onclick="showMaps()">${T.back}</button></div>`;
}

function showInvitedChars() {
    let html = `<h2>ЗАПРОШЕНІ ГЕРОЇ</h2><div class="scroll-list">`;
    CHARACTER_DATA.filter(c => playerProgress.unlockedChars.includes(c.id)).forEach(char => {
        html += `<div class="list-item" style="display:flex; align-items:center; gap:15px;"><img src="${char.img}" style="width:50px; border-radius:8px; border: 1px solid gold;"><b>${char.name[gameState.lang]}</b></div>`;
    });
    html += `</div><button class="btn-blue" style="width:100%" onclick="showMain()">НАЗАД</button>`;
    renderer.innerHTML = `<div class="menu-container">${html}</div>`;
}

function showVictoryScreen() {
    const T = TRANSLATIONS[gameState.lang];
    renderer.classList.remove('hidden');
    renderer.innerHTML = `<div class="menu-container" style="border-color: #2ecc71; box-shadow: 0 0 40px rgba(46, 204, 113, 0.4);"><h1 style="color: #2ecc71;">${T.victory}</h1><button class="btn-blue" style="width:100%" onclick="${gameState.stageIdx >= 2 ? 'location.reload()' : 'nextStage()'}">${gameState.stageIdx >= 2 ? T.finish : T.next}</button></div>`;
}

function nextStage() { renderer.innerHTML = ''; renderer.classList.add('hidden'); gameState.stageIdx++; startGame(); }

showMain();