/**
 * UI.JS - Виправлений та покращений інтерфейс
 */

const renderer = document.getElementById('screen-renderer');

// --- 1. ГОЛОВНЕ МЕНЮ ---
function toggleLang() {
    gameState.lang = gameState.lang === 'uk' ? 'en' : 'uk';
    showMain();
}

function showMain() {
    const T = TRANSLATIONS[gameState.lang];
    renderer.classList.remove('hidden');
    renderer.innerHTML = `
        <div class="menu-container main-menu-bg">
            <button class="lang-switch" onclick="toggleLang()">UK / EN</button>
            <h1 class="game-title">${T.title}</h1>
            <div class="button-grid">
                <button class="btn-blue" onclick="showMaps()">${T.maps}</button>
                <button class="btn-blue" onclick="showInvitedChars()">${T.invited_chars}</button>
                <button class="btn-blue" onclick="showInvitations()">${T.invitation}</button>
                <button class="btn-blue" onclick="showShop()">${T.shop}</button>
                <button class="btn-blue" onclick="showBestiary()">${T.bestiary}</button>
                <button class="btn-blue" onclick="showChars()">${T.chars}</button>
            </div>
            <div style="margin-top:15px; background: rgba(0,0,0,0.5); padding: 10px; border-radius: 10px;">
                <span style="color:gold;">⚪ ${playerProgress.pearls} ${T.pearls}</span> | 
                <span class="sand-text">⏳ ${playerProgress.blackSand} ${T.black_sand}</span>
            </div>
        </div>
    `;
}

// --- 2. ГЕРОЇ (ВИПРАВЛЕНО: АНКЕТИ ПОВЕРНУТО) ---
function showChars() {
    const T = TRANSLATIONS[gameState.lang];
    let html = `<h2>${T.chars}</h2><div class="scroll-list">`;

    CHARACTER_DATA.forEach(char => {
        const isUnlocked = playerProgress.unlockedChars.includes(char.id);
        const name = char.name[gameState.lang];
        const stats = char.stats;

        html += `
            <div class="list-item char-card ${!isUnlocked ? 'locked-char' : ''}" style="margin-bottom:20px; text-align:left;">
                <div style="display:flex; gap:15px;">
                    <img src="${char.img}" style="width:100px; border:2px solid var(--gold); border-radius:10px;">
                    <div>
                        <h3 style="color:var(--gold); margin:0;">${name}</h3>
                        <p style="margin:2px 0;"><small><b>${T.age}:</b> ${stats.age[gameState.lang] || stats.age}</small></p>
                        <p style="margin:2px 0;"><small><b>${T.race}:</b> ${stats.race[gameState.lang] || stats.race}</small></p>
                        <p style="margin:2px 0;"><small><b>${T.activity}:</b> ${stats.activity[gameState.lang] || stats.activity}</small></p>
                    </div>
                </div>
                <div style="margin-top:10px; border-top:1px solid rgba(255,215,0,0.2); padding-top:5px;">
                    <p style="font-size:13px; font-style:italic;">${stats.bio[gameState.lang] || stats.bio}</p>
                </div>
                ${!isUnlocked ? `<div class="lock-overlay">🔒 ${T.locked}</div>` : ''}
            </div>
        `;
    });

    html += `</div><button class="btn-blue" style="width:100%" onclick="showMain()">${T.back}</button>`;
    renderer.innerHTML = `<div class="menu-container" style="width:550px;">${html}</div>`;
}

// --- 3. КРАМНИЦЯ (ВИПРАВЛЕНО: КНОПКУ ПРОДАЖУ ПОВЕРНУТО + АПГРЕЙД) ---
function showShop() {
    const T = TRANSLATIONS[gameState.lang];
    if (!playerProgress.shopUnlocked) {
        alert(gameState.lang === 'uk' ? "Крамниця закрита! Здолайте Кракена на НОРМАЛЬНІЙ складності." : "Shop locked!");
        return;
    }

    renderer.innerHTML = `
        <div class="menu-container shop-bg" style="width:600px;">
            <h2 style="color:var(--gold)">${T.shop}</h2>
            
            <div style="display:flex; gap:20px; align-items:center; background:rgba(0,0,0,0.4); padding:10px; border-radius:10px; margin-bottom:15px;">
                <img src="assets/mermaid.png" style="width:100px;">
                <p style="font-style:italic; font-size:14px;">"${gameState.lang === 'uk' ? 'Привіт, мореплавцю. Обміняємо твої трофеї на блискучі перлини?' : 'Hello, sailor. Shall we trade your trophies for some shiny pearls?'}"</p>
            </div>

            <div class="scroll-list" style="max-height:350px;">
                <h3 style="color:gold; text-align:left; border-bottom:1px solid gold;">🛒 ${T.goods}</h3>
                ${SHOP_ITEMS.map(item => {
                    const isBought = item.id === 'machete' && playerProgress.boughtWeapons.includes('machete');
                    return `
                    <div class="list-item" style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="text-align:left;"><b>${item.name}</b><br><small>${item.desc}</small></span>
                        <button class="btn-small" ${isBought ? 'disabled' : `onclick="buyItem('${item.id}', ${item.price})"`}>
                            ${isBought ? '✓' : `${item.price} ⚪`}
                        </button>
                    </div>`;
                }).join('')}

                <h3 style="color:#2ecc71; text-align:left; border-bottom:1px solid #2ecc71; margin-top:20px;">💎 ${T.loot}</h3>
                ${playerProgress.inventory.length === 0 ? `<p style="opacity:0.6;"><small>${gameState.lang === 'uk' ? 'Трофеїв немає' : 'No trophies'}</small></p>` : ""}
                ${playerProgress.inventory.map((key, index) => {
                    const item = LEGENDARY_ITEMS[key];
                    return `
                    <div class="list-item" style="display:flex; justify-content:space-between; align-items:center;">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <img src="${item.img}" style="width:30px;">
                            <span>${item.name}</span>
                        </div>
                        <button class="btn-small" style="background:#2ecc71; color:white;" onclick="sellItem(${index}, '${key}')">
                            ${gameState.lang === 'uk' ? 'ПРОДАТИ' : 'SELL'} (+${item.price} ⚪)
                        </button>
                    </div>`;
                }).join('')}
            </div>

            <div style="margin-top:15px; font-weight:bold; color:gold;">
                ⚪ ${playerProgress.pearls} ${T.pearls}
            </div>
            <button class="btn-blue" style="width:100%; margin-top:10px;" onclick="showMain()">${T.back}</button>
        </div>
    `;
}

function buyItem(id, price) {
    if (playerProgress.pearls < price) return alert("Недостатньо перлин!");
    playerProgress.pearls -= price;
    if (id === 'machete') playerProgress.boughtWeapons.push('machete');
    if (id === 'scroll_about') showScrollChoice();
    saveGame();
    showShop();
}

function sellItem(index, key) {
    const price = LEGENDARY_ITEMS[key].price;
    playerProgress.pearls += price;
    playerProgress.inventory.splice(index, 1);
    saveGame();
    showShop();
}

// --- 4. ГАЧА (ЗАПРОШЕННЯ) ---
function showInvitations() {
    const T = TRANSLATIONS[gameState.lang];
    renderer.innerHTML = `
        <div class="menu-container">
            <h2>${T.invitation}</h2>
            <div style="margin-bottom:20px;">
                <button class="btn-blue" style="width:100%" onclick="rollGacha()">🍀 ${gameState.lang === 'uk' ? 'ПОКРУТИТИ' : 'ROLL'} (Free)</button>
                <button class="btn-blue" style="width:100%; margin-top:10px;" onclick="buyGachaChar()">💎 ${gameState.lang === 'uk' ? 'КУПИТИ ГЕРОЯ' : 'BUY HERO'} (100 ⚪)</button>
            </div>
            <div style="border-top:1px solid gold; padding-top:10px;">
                <p class="sand-text">⏳ ${playerProgress.blackSand} ${T.black_sand}</p>
                <button class="btn-small" onclick="exchangeSand()">Обміняти 1 ⏳ на 5 ⚪</button>
            </div>
            <button class="btn-blue" style="width:100%; margin-top:20px;" onclick="showMain()">${T.back}</button>
        </div>
    `;
}

function rollGacha() {
    renderer.innerHTML = `
        <div class="menu-container">
            <div class="gacha-spinner">⏳</div>
            <p style="color:gold; font-weight:bold;">Прикликання...</p>
        </div>
    `;

    setTimeout(() => {
        const chance = Math.random() * 100;
        if (chance <= 30) {
            const locked = CHARACTER_DATA.filter(c => !playerProgress.unlockedChars.includes(c.id));
            if (locked.length > 0) {
                const newChar = locked[Math.floor(Math.random() * locked.length)];
                playerProgress.unlockedChars.push(newChar.id);
                showGachaResult(newChar.img, `${gameState.lang === 'uk' ? 'НОВИЙ ГЕРОЙ:' : 'NEW HERO:'} ${newChar.name[gameState.lang]}`, 'gold');
            } else {
                playerProgress.blackSand += 3;
                showGachaResult(null, "Усі герої зібрані! +3 ⏳", '#8e44ad');
            }
        } else {
            playerProgress.blackSand += 1;
            showGachaResult(null, "Отримано Чорний Пісок!", '#8e44ad');
        }
        saveGame();
    }, 1200);
}

function showGachaResult(img, text, color) {
    renderer.innerHTML = `
        <div class="menu-container" style="border:3px solid ${color} !important; box-shadow: 0 0 20px ${color};">
            ${img ? `<img src="${img}" style="width:150px; border:2px solid gold; border-radius:10px;">` : '<div style="font-size:60px;">⏳</div>'}
            <h3 style="color:${color}; margin:15px 0;">${text}</h3>
            <button class="btn-blue" onclick="showInvitations()">ОК</button>
        </div>
    `;
}

function exchangeSand() {
    if (playerProgress.blackSand > 0) {
        playerProgress.blackSand--;
        playerProgress.pearls += 5;
        saveGame();
        showInvitations();
    }
}

// --- 5. ІНШЕ (МАПИ, БЕСТІАРІЙ, ПЕРЕМОГА) ---
function showMaps() {
    const T = TRANSLATIONS[gameState.lang];
    let html = `<h2>${T.maps}</h2>`;
    MAP_DATA.forEach(map => {
        const isLocked = map.id === 4 && playerProgress.completedMaps.length < 4;
        html += `<button class="btn-blue" style="width:100%; opacity: ${isLocked ? 0.5 : 1}" 
                onclick="${isLocked ? `alert('Пройдіть перші 4 мапи!')` : `selectMap(${map.id})`}">
                ${isLocked ? "🔒 " : ""}${map.name}</button>`;
    });
    html += `<button class="btn-blue" style="background:#444; width:100%" onclick="showMain()">${T.back}</button>`;
    renderer.innerHTML = `<div class="menu-container">${html}</div>`;
}

function selectMap(id) {
    gameState.mapId = id;
    gameState.stageIdx = 0;
    if (id === 4) showBlairwoodDialogue(); else showDifficulty();
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

function showDifficulty() {
    const T = TRANSLATIONS[gameState.lang];
    renderer.innerHTML = `<div class="menu-container"><h2>${T.diff}</h2>
        <button class="btn-blue" style="width:100%" onclick="setDiff('easy')">${T.easy}</button>
        <button class="btn-blue" style="width:100%" onclick="setDiff('normal')">${T.normal}</button>
        <button class="btn-blue" style="width:100%" onclick="setDiff('jaws')">${T.jaws}</button>
        <button class="btn-blue" style="background:#444; width:100%" onclick="showMaps()">${T.back}</button></div>`;
}

function setDiff(d) { gameState.difficulty = d; showWeaponSelection(); }

function showWeaponSelection() {
    const hasMachete = playerProgress.boughtWeapons.includes('machete');
    renderer.innerHTML = `<div class="menu-container"><h2>ЗБРОЯ</h2>
        <button class="btn-blue" style="width:100%" onclick="setWeapon('none')">БЕЗ ЗБРОЇ</button>
        ${hasMachete ? `<button class="btn-blue" style="width:100%" onclick="setWeapon('machete')">МАЧЕТА</button>` : `<button class="btn-blue" style="width:100%; opacity:0.5;" onclick="alert('Купіть у крамниці!')">МАЧЕТА (🔒)</button>`}
        </div>`;
}

function setWeapon(w) { gameState.weapon = w; startGame(); }

function showBestiary() {
    const T = TRANSLATIONS[gameState.lang];
    let html = `<h2>${T.bestiary}</h2><div class="scroll-list">`;
    for (let catKey in BESTIARY_CATEGORIES) {
        html += `<h3 style="color:gold; border-bottom:1px solid gold; text-align:left;">${BESTIARY_CATEGORIES[catKey][gameState.lang]}</h3>`;
        BESTIARY_DATA.filter(i => i.category === catKey).forEach(m => {
            html += `<div class="list-item" style="text-align:left;"><b>${m.name}</b><br><small>${m.desc}</small></div>`;
        });
    }
    html += `</div><button class="btn-blue" style="width:100%" onclick="showMain()">${T.back}</button>`;
    renderer.innerHTML = `<div class="menu-container">${html}</div>`;
}

function showInvitedChars() {
    let html = `<h2>ЗАПРОШЕНІ ГЕРОЇ</h2><div class="scroll-list">`;
    const invited = CHARACTER_DATA.filter(c => playerProgress.unlockedChars.includes(c.id));
    invited.forEach(char => {
        html += `<div class="list-item" style="display:flex; align-items:center; gap:10px;">
                <img src="${char.img}" style="width:40px; border-radius:5px;">
                <b>${char.name[gameState.lang]}</b></div>`;
    });
    html += `</div><button class="btn-blue" style="width:100%" onclick="showMain()">НАЗАД</button>`;
    renderer.innerHTML = `<div class="menu-container">${html}</div>`;
}

function showScrollChoice() {
    renderer.innerHTML = `<div class="menu-container">
        <button class="btn-blue" style="width:100%" onclick="showLegendContent('oceans_curse')">Прокляття Океанів</button>
        <button class="btn-blue" style="width:100%" onclick="showLegendContent('guardian_legend')">Страж Лагуни</button>
        <button class="btn-blue" style="width:100%" onclick="showLegendContent('god_abyss')">Бог Безодні</button>
        <button class="btn-blue" style="width:100%; background:#444" onclick="showShop()">НАЗАД</button></div>`;
}

function showLegendContent(key) {
    const legend = LEGENDS_TEXT[gameState.lang][key];
    renderer.innerHTML = `<div class="menu-container" style="width:500px;">
        <h2>${legend.title}</h2>
        <div class="scroll-list" style="text-align:justify;"><p>${legend.text}</p></div>
        <button class="btn-blue" style="width:100%" onclick="showScrollChoice()">НАЗАД</button></div>`;
}

function showVictoryScreen() {
    const T = TRANSLATIONS[gameState.lang];
    renderer.classList.remove('hidden');
    renderer.innerHTML = `<div class="menu-container"><h1>${T.victory}</h1>
        <button class="btn-blue" style="width:100%" onclick="${gameState.stageIdx < 2 ? 'nextStage()' : 'location.reload()'}">${gameState.stageIdx < 2 ? T.next : T.finish}</button></div>`;
}

function nextStage() { gameState.stageIdx++; startGame(); }

showMain();