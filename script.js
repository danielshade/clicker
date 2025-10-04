// --- ІНІЦІАЛІЗАЦІЯ FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyARafgEdXXxc_jxw6TZnxJmg0mWTiARtjQ",
  authDomain: "watery-agony.firebaseapp.com",
  projectId: "watery-agony",
  storageBucket: "watery-agony.firebasestorage.app",
  messagingSenderId: "45840830431",
  appId: "1:45840830431:web:6dd170ff1bc0596571fe6a"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// --- ГОЛОВНА СТРУКТУРА ДАНИХ ГРИ ---
const gameConfig = {
    enemies: {
        shark1:      { src: './assets/shark_1.png', sizeClass: 'shark' },
        shark2:      { src: './assets/shark_2.png', sizeClass: 'shark' },
        shark3:      { src: './assets/shark_3.png', sizeClass: 'shark' },
        octopus:     { src: './assets/octopus.png', sizeClass: 'octopus' },
        barracuda:   { src: './assets/barracuda.png', sizeClass: 'barracuda' },
        white_shark: { src: './assets/white_shark.png', sizeClass: 'miniboss', hp: 20, points: 10, damage: 2 },
        squid:       { src: './assets/squid.png', sizeClass: 'squid', hp: 25, points: 15, damage: 2, pattern: 'wavy' },
        megalodon:   { src: './assets/megalodon.png', sizeClass: 'finalboss', pattern: 'vertical', hp: { easy: 38, normal: 50, jaws: 100 }, damage: 5 },
        kraken:      { src: './assets/kraken.png', sizeClass: 'kraken', pattern: 'vertical', hp: { easy: 45, normal: 60, jaws: 120 }, damage: 5 }
    },
    mapsData: [ KINGS_COAST_DATA, ABYSS_SHACKLES_DATA ]
};

const translations = {
    uk: {
        map: "Карта Світу", map1: "Узбережжя Короля", map2: "Окови Безодні", map2Locked: "(Перемогти на Нормалі+)", play: "Грати", back: "Назад",
        shop: "Забавульки Русалки", shopWeapon: "Зброя", shopWeaponDesc: "Нові гарпуни (скоро)", shopScrolls: "Свитки", shopScrollsDesc: "Древні історії (скоро)", shopLife: "Життя", shopLifeDesc: "+1 ❤️ (10 Перлин)", shopBuy: "Купити", pearl: "Перлин", shopLifeLock: "Перемогти боса на Нормальній складності",
        login: "Вхід", register: "Реєстрація", logout: "Вийти", authError: "Помилка: ", authButton: "Увійти / Зареєструватися",
        stanleyDialogue: "Аррр, друже! Я — старий Стенлі Акулосмерть! Ці прокляті акули знову тероризують мої береги! Допоможеш старому пірату?", gameTitle: "Водяна Агонія", langLabel: "Мова", diffLabel: "Складність", level: "Рівень", score: "Очки", time: "Час", startButton: "Старт", playButton: "В БІЙ!", diffEasy: "Легко пливу", diffNormal: "Норм. зависаю", diffJaws: "JAWS", pause: "Пауза", resume: "Продовжити", mainMenu: "Головне меню", pauseTitle: "ПАУЗА", gameOver: "ГРУ ЗАВЕРШЕНО", timeUp: "Час вийшов!", win: "ПЕРЕМОГА!", winMsg: "Ти захистив берег!", finalScore: "Ви досягли рівня", restartButton: "ГРАТИ ЗНОВУ", finalBossNotification: "Це він! Мегалодон, що забрав мого брата! Не дай йому дістатися поверхні, благаю!", finalWin: "Ти це зробив! Ти помстився за мого брата!", backToMenu: "В меню"
    },
    en: {
        map: "World Map", map1: "King's Coast", map2: "Abyss Shackles", map2Locked: "(Defeat on Normal+)", play: "Play", back: "Back",
        shop: "The Mermaid's Trinkets", shopWeapon: "Weapons", shopWeaponDesc: "New harpoons (soon)", shopScrolls: "Scrolls", shopScrollsDesc: "Ancient tales (soon)", shopLife: "Life", shopLifeDesc: "+1 ❤️ (10 Pearls)", shopBuy: "Buy", pearl: "Pearls", shopLifeLock: "Defeat boss on Normal",
        login: "Login", register: "Register", logout: "Logout", authError: "Error: ", authButton: "Login / Register",
        stanleyDialogue: "Arrr, matey! The name's Stanley Sharkdeath! These cursed sharks are terrorizin' me shores again! Will ye help an old pirate out?", gameTitle: "Watery Agony", langLabel: "Language", diffLabel: "Difficulty", level: "Level", score: "Score", time: "Time", startButton: "Start", playButton: "TO BATTLE!", diffEasy: "Easy Swim", diffNormal: "Hanging Out", diffJaws: "JAWS", pause: "Pause", resume: "Resume", mainMenu: "Main Menu", pauseTitle: "PAUSED", gameOver: "GAME OVER", timeUp: "Time is up!", win: "VICTORY!", winMsg: "You've protected the shores!", finalScore: "You reached level", restartButton: "PLAY AGAIN", finalBossNotification: "That's him! The Megalodon that took me brother! Don't let him reach the surface, I beg ye!", finalWin: "You did it! You avenged me brother!", backToMenu: "To Menu"
    }
};
const difficultySettings = { easy: { minSpeed: 0.8, maxSpeed: 1.5, spawnInterval: 1200, points: 3 }, normal: { minSpeed: 1.5, maxSpeed: 2.5, spawnInterval: 900,  points: 1 }, jaws:   { minSpeed: 2.5, maxSpeed: 4.0, spawnInterval: 600,  points: 1/3 } };
const GOAL_SCORE = 50;

let gameState = { currentMap: 0, currentLevel: 0, score: 0, timeLeft: 120, playerHealth: 10, currentLang: 'uk', currentDifficulty: 'easy', isPaused: false, bossOnScreen: false, animationFrameId: null, intervals: [], activeTargets: [] };
let playerData = { pearls: 0, megalodonDefeatedOn: null, krakenDefeatedOn: null };

let allScreens, gameUi, stanleyNotification, notificationText, pearlDisplay, buyLifeButton, authScreen, loginTab, registerTab, authEmail, authPassword, authError, authSubmitButton, authBackButton, userInfo, userEmail, logoutButton, authButton;
let isLoginMode = true;

function savePlayerData() { localStorage.setItem('wateryAgonyData', JSON.stringify(playerData)); }
function loadPlayerData() { const data = localStorage.getItem('wateryAgonyData'); if (data) playerData = JSON.parse(data); }

document.addEventListener('DOMContentLoaded', () => {
    allScreens = { main: document.getElementById('mainMenuScreen'), setup: document.getElementById('setupScreen'), map: document.getElementById('mapScreen'), shop: document.getElementById('shopScreen'), gameover: document.getElementById('gameOverScreen'), pause: document.getElementById('pauseScreen'), auth: document.getElementById('authScreen') };
    gameUi = { container: document.getElementById('uiContainer'), controls: document.getElementById('inGameControls'), health: document.getElementById('playerHealthDisplay') };
    stanleyNotification = document.getElementById('stanley-notification');
    notificationText = document.getElementById('notification-text');
    pearlDisplay = document.getElementById('pearl-display');
    buyLifeButton = document.getElementById('buyLifeButton');
    authScreen = document.getElementById('authScreen');
    loginTab = document.getElementById('loginTab');
    registerTab = document.getElementById('registerTab');
    authEmail = document.getElementById('authEmail');
    authPassword = document.getElementById('authPassword');
    authError = document.getElementById('authError');
    authSubmitButton = document.getElementById('authSubmitButton');
    authBackButton = document.getElementById('authBackButton');
    userInfo = document.getElementById('userInfo');
    userEmail = document.getElementById('userEmail');
    logoutButton = document.getElementById('logoutButton');
    authButton = document.getElementById('authButton');

    loadPlayerData();
    attachEventListeners();
    updateUIText();
    showScreen('main');

    auth.onAuthStateChanged(user => {
        const gameButtons = [document.getElementById('startButton'), document.getElementById('mapButton'), document.getElementById('mainMenuShopButton')];
        if (user) {
            userInfo.classList.remove('hidden');
            userEmail.textContent = user.email;
            authButton.classList.add('hidden');
            gameButtons.forEach(b => b.disabled = false);
        } else {
            userInfo.classList.add('hidden');
            authButton.classList.remove('hidden');
            gameButtons.forEach(b => b.disabled = true);
        }
    });
});

function attachEventListeners() {
    document.getElementById('lang-selector').addEventListener('click', (e) => { if (e.target.tagName === 'BUTTON') { gameState.currentLang = e.target.dataset.lang; updateUIText(); document.getElementById('lang-selector').querySelector('.selected').classList.remove('selected'); e.target.classList.add('selected'); } });
    document.getElementById('startButton').addEventListener('click', () => { gameState.currentMap = 0; showScreen('setup'); });
    document.getElementById('mapButton').addEventListener('click', openMapScreen);
    document.getElementById('mainMenuShopButton').addEventListener('click', openShop);
    document.getElementById('difficulty-selector').addEventListener('click', (e) => { if (e.target.tagName === 'BUTTON') { gameState.currentDifficulty = e.target.dataset.difficulty; document.getElementById('difficulty-selector').querySelector('.selected').classList.remove('selected'); e.target.classList.add('selected'); } });
    document.getElementById('playButton').addEventListener('click', startGame);
    document.getElementById('backToMainButton').addEventListener('click', () => showScreen('main'));
    document.getElementById('mapBackButton').addEventListener('click', () => showScreen('main'));
    document.getElementById('playMap1Button').addEventListener('click', () => { gameState.currentMap = 0; showScreen('setup'); });
    document.getElementById('playMap2Button').addEventListener('click', () => { gameState.currentMap = 1; showScreen('setup'); });
    document.getElementById('restartButton').addEventListener('click', returnToMenu);
    document.getElementById('pauseButton').addEventListener('click', togglePause);
    document.getElementById('resumeButton').addEventListener('click', togglePause);
    document.getElementById('returnToMenuButton').addEventListener('click', returnToMenu);
    document.getElementById('openShopButton').addEventListener('click', openShop);
    document.getElementById('shopBackButton').addEventListener('click', returnToMenu);
    authButton.addEventListener('click', () => { switchAuthTab('login'); showScreen('auth'); });
    authBackButton.addEventListener('click', () => showScreen('main'));
    loginTab.addEventListener('click', () => switchAuthTab('login'));
    registerTab.addEventListener('click', () => switchAuthTab('register'));
    authSubmitButton.addEventListener('click', handleAuthSubmit);
    logoutButton.addEventListener('click', handleLogout);
}

function showScreen(screenName) { Object.values(allScreens).forEach(s => s.classList.add('hidden')); Object.values(gameUi).forEach(el => el.classList.add('hidden')); if (allScreens[screenName]) allScreens[screenName].classList.remove('hidden'); }
function updateUIText() { const T = translations[gameState.currentLang]; const DOMElements = { 'gameTitle': T.gameTitle, 'startButton': T.startButton, 'mapButton': T.map, 'mainMenuShopButton': T.shop, 'authButton': T.authButton, 'loginTab': T.login, 'registerTab': T.register, 'setupDiffLabel': T.diffLabel, 'diffBtnEasy': T.diffEasy, 'diffBtnNormal': T.diffNormal, 'diffBtnJaws': T.diffJaws, 'playButton': T.playButton, 'backToMainButton': T.back, 'mapTitle': T.map, 'map1Title': T.map1, 'map2Title': T.map2, 'map2Locked': T.map2Locked, 'mapBackButton': T.back, 'playMap1Button': T.play, 'playMap2Button': T.play, 'pauseButton': T.pause, 'resumeButton': T.resume, 'returnToMenuButton': T.mainMenu, 'pauseTitle': T.pauseTitle, 'stanley-dialogue': T.stanleyDialogue, 'shopTitle': T.shop, 'shopWeaponTitle': T.shopWeapon, 'shopWeaponDesc': T.shopWeaponDesc, 'shopScrollsTitle': T.shopScrolls, 'shopScrollsDesc': T.shopScrollsDesc, 'shopLifeTitle': T.shopLife, 'shopLifeDesc': T.shopLifeDesc, 'shopBackButton': T.backToMenu, 'openShopButton': T.shop, 'logoutButton': T.logout, 'authBackButton': T.back }; for (const id in DOMElements) { const el = document.getElementById(id); if (el) el.textContent = DOMElements[id]; } authSubmitButton.textContent = isLoginMode ? T.login : T.register; }
function updateGameUI() { const T = translations[gameState.currentLang]; playerHealthDisplay.textContent = `❤️ ${Math.max(0, gameState.playerHealth)}`; const levelName = gameConfig.mapsData[gameState.currentMap].levels[gameState.currentLevel][`name_${gameState.currentLang}`]; levelDisplay.textContent = `${T.level}: ${levelName}`; if (!gameConfig.mapsData[gameState.currentMap].levels[gameState.currentLevel].finalBoss) scoreDisplay.textContent = `${T.score}: ${Math.floor(gameState.score)} / ${GOAL_SCORE}`; timerDisplay.textContent = `${T.time}: ${gameState.timeLeft}`; }
function startGame() { showScreen('none'); Object.values(gameUi).forEach(el => el.classList.remove('hidden')); gameState.playerHealth = 10; gameState.currentLevel = 0; startLevel(); if (!gameState.animationFrameId) gameLoop(); }
function startLevel() { const map = gameConfig.mapsData[gameState.currentMap]; const level = map.levels[gameState.currentLevel]; if (level.finalBoss) { triggerFinalBossSequence(); return; } stopGameActivity(false); gameState.bossOnScreen = false; gameState.score = 0; gameState.timeLeft = 120; document.getElementById('gameContainer').className = ''; document.getElementById('gameContainer').classList.add(map.background); timerDisplay.classList.remove('hidden'); scoreDisplay.classList.remove('hidden'); scoreDisplay.textContent = `${translations[gameState.currentLang].score}: 0 / ${GOAL_SCORE}`; updateGameUI(); const difficulty = difficultySettings[gameState.currentDifficulty]; gameState.intervals.push(setInterval(() => { const enemyPool = level.enemies; const randomEnemy = enemyPool[Math.floor(Math.random() * enemyPool.length)]; createTarget(randomEnemy); }, difficulty.spawnInterval)); gameState.intervals.push(setInterval(updateTimer, 1000)); if (level.miniboss) gameState.intervals.push(setTimeout(() => createTarget(level.miniboss, false, true), 10000 + Math.random() * 5000)); }
function triggerFinalBossSequence() { stopGameActivity(true); if (gameState.currentMap === 0) { notificationText.textContent = translations[gameState.currentLang].finalBossNotification; stanleyNotification.classList.remove('hidden'); stanleyNotification.classList.add('show'); setTimeout(() => { stanleyNotification.classList.remove('show'); setTimeout(() => { stanleyNotification.classList.add('hidden'); startFinalBossLevel(); }, 500); }, 6000); } else { startFinalBossLevel(); } }
function startFinalBossLevel() { stopGameActivity(true); const map = gameConfig.mapsData[gameState.currentMap]; const level = map.levels[gameState.currentLevel]; const bossType = level.finalBoss; gameState.bossOnScreen = false; gameState.timeLeft = 999; gameState.score = 0; document.getElementById('gameContainer').className = ''; document.getElementById('gameContainer').classList.add(level.background || map.background); updateGameUI(); timerDisplay.classList.add('hidden'); scoreDisplay.classList.add('hidden'); createTarget(bossType, true); }
function createTarget(type, isFinalBoss = false, isMiniboss = false) { if ((isMiniboss || isFinalBoss) && gameState.bossOnScreen) return; if (isMiniboss || isFinalBoss) gameState.bossOnScreen = true; const enemyData = gameConfig.enemies[type]; if (!enemyData) return; const element = document.createElement('img'); element.src = enemyData.src; element.className = `target ${enemyData.sizeClass}`; const targetObject = { element, type, isFinalBoss, isMiniboss }; if (isMiniboss || isFinalBoss) { targetObject.hp = isFinalBoss ? enemyData.hp[gameState.currentDifficulty] : enemyData.hp; targetObject.maxHp = targetObject.hp; const healthBarContainer = document.createElement('div'); healthBarContainer.className = 'health-bar-container'; const healthBar = document.createElement('div'); healthBar.className = 'health-bar'; healthBarContainer.appendChild(healthBar); element.appendChild(healthBarContainer); targetObject.healthBar = healthBar; } targetObject.pattern = enemyData.pattern || ['horizontal', 'diagonal', 'wavy'][Math.floor(Math.random() * 3)]; const difficulty = difficultySettings[gameState.currentDifficulty]; let speed = (difficulty.minSpeed + Math.random() * (difficulty.maxSpeed - difficulty.minSpeed)); if(isMiniboss) speed *= 0.8; if(isFinalBoss) speed *= 0.6; let startX, startY, speedX = 0, speedY = 0; const direction = Math.random() < 0.5 ? 1 : -1; if (targetObject.pattern === 'vertical') { startX = Math.random() * (gameContainer.clientWidth - 250); startY = gameContainer.clientHeight; speedY = -speed; } else { speedX = speed * direction; startX = direction === 1 ? -200 : gameContainer.clientWidth; startY = Math.random() * (gameContainer.clientHeight - 150); element.style.transform = direction === -1 ? 'scaleX(-1)' : ''; } element.style.top = `${startY}px`; element.style.left = `${startX}px`; Object.assign(targetObject, { x: startX, y: startY, speedX, speedY, startY_wave: startY, waveAmp: 40 + Math.random() * 40, waveFreq: 0.01 + Math.random() * 0.01 }); gameState.activeTargets.push(targetObject); element.addEventListener('click', () => { if (gameState.isPaused) return; if (isMiniboss || isFinalBoss) { targetObject.hp--; targetObject.healthBar.style.width = `${(targetObject.hp / targetObject.maxHp) * 100}%`; if (targetObject.hp <= 0) { if (isFinalBoss) endGame(true, "", true); else { gameState.score += enemyData.points; gameState.bossOnScreen = false; } element.classList.add('dying'); setTimeout(() => element.remove(), 300); gameState.activeTargets = gameState.activeTargets.filter(t => t !== targetObject); } } else { gameState.score += difficultySettings[gameState.currentDifficulty].points; element.classList.add('dying'); setTimeout(() => element.remove(), 300); gameState.activeTargets = gameState.activeTargets.filter(t => t !== targetObject); } updateGameUI(); if (!isMiniboss && !isFinalBoss && gameState.score >= GOAL_SCORE) { gameState.currentLevel++; if (gameState.currentLevel >= gameConfig.mapsData[gameState.currentMap].levels.length - 1) startLevel(); else startLevel(); } }); gameContainer.appendChild(element); }
function gameLoop() { if (!gameState.isPaused) { for (let i = gameState.activeTargets.length - 1; i >= 0; i--) { const target = gameState.activeTargets[i]; switch(target.pattern) { case 'horizontal': target.x += target.speedX; break; case 'diagonal': target.x += target.speedX; target.y += (target.speedY || target.speedX * 0.3); if (target.y < 0 || target.y > gameContainer.clientHeight - 100) target.speedY *= -1; break; case 'wavy': target.x += target.speedX; target.y = target.startY_wave + Math.sin(target.x * target.waveFreq) * target.waveAmp; break; case 'vertical': target.y += target.speedY; break; } target.element.style.left = `${target.x}px`; target.element.style.top = `${target.y}px`; let escapedHorizontal = target.pattern !== 'vertical' && (target.x > gameContainer.clientWidth + 50 || target.x < -200); let escapedTop = target.pattern === 'vertical' && target.y < -150; if (escapedTop && target.isFinalBoss) { gameState.playerHealth -= gameConfig.enemies[target.type].damage; target.y = gameContainer.clientHeight; updateGameUI(); if (gameState.playerHealth <= 0) { endGame(false, translations[gameState.currentLang].playerDied); return; } } else if (escapedHorizontal) { if (target.isMiniboss) { gameState.playerHealth -= gameConfig.enemies[target.type].damage; gameState.bossOnScreen = false; updateGameUI(); if (gameState.playerHealth <= 0) { endGame(false, translations[gameState.currentLang].playerDied); return; } } target.element.remove(); gameState.activeTargets.splice(i, 1); } } } gameState.animationFrameId = requestAnimationFrame(gameLoop); }
function updateTimer() { if (gameState.isPaused) return; gameState.timeLeft--; updateGameUI(); if (gameState.timeLeft <= 0 && gameState.currentLevel !== 4) { endGame(false, translations[gameState.currentLang].timeUp); } }
function endGame(didWin, customMessage = "", isFinalVictory = false) { stopGameActivity(true); const T = translations[gameState.currentLang]; const openShopButtonEl = document.getElementById('openShopButton'); const gameOverTitleEl = document.getElementById('gameOverTitle'); const gameOverMessageEl = document.getElementById('gameOverMessage'); const restartButtonEl = document.getElementById('restartButton'); openShopButtonEl.classList.add('hidden'); if (isFinalVictory) { if (gameState.currentMap === 0 && !playerData.megalodonDefeatedOn) { playerData.pearls += 7; } if (gameState.currentMap === 1 && !playerData.krakenDefeatedOn) { playerData.pearls += 10; } if (gameState.currentMap === 0) playerData.megalodonDefeatedOn = gameState.currentDifficulty; if (gameState.currentMap === 1) playerData.krakenDefeatedOn = gameState.currentDifficulty; savePlayerData(); gameOverTitleEl.textContent = T.finalWin; gameOverMessageEl.textContent = T.winMsg; openShopButtonEl.classList.remove('hidden'); } else { gameOverTitleEl.textContent = T.gameOver; gameOverMessageEl.textContent = customMessage || `${T.finalScore} '${gameConfig.mapsData[gameState.currentMap].levels[gameState.currentLevel][`name_${gameState.currentLang}`]}'.`; } restartButtonEl.textContent = T.restartButton; allScreens.gameover.classList.remove('hidden'); }
function togglePause() { gameState.isPaused = !gameState.isPaused; const T = translations[gameState.currentLang]; if (gameState.isPaused) { document.getElementById('pauseButton').textContent = T.resume; allScreens.pause.classList.remove('hidden'); } else { document.getElementById('pauseButton').textContent = T.pause; allScreens.pause.classList.add('hidden'); } }
function stopGameActivity(clearScreen) { gameState.intervals.forEach(i => { clearInterval(i); clearTimeout(i); }); gameState.intervals = []; if (clearScreen) { gameState.activeTargets.forEach(t => t.element.remove()); gameState.activeTargets = []; } gameState.isPaused = false; }
function returnToMenu() { stopGameActivity(true); showScreen('main'); if (gameState.animationFrameId) { cancelAnimationFrame(gameState.animationFrameId); gameState.animationFrameId = null; } }
function openShop() { showScreen('shop'); const T = translations[gameState.currentLang]; pearlDisplay.textContent = `${T.pearl}: ${playerData.pearls}`; if (playerData.megalodonDefeatedOn === 'normal' || playerData.megalodonDefeatedOn === 'jaws') { buyLifeButton.disabled = false; buyLifeButton.textContent = T.shopBuy; } else { buyLifeButton.disabled = true; buyLifeButton.textContent = T.shopLifeLock; } }
function openMapScreen() { showScreen('map'); const map2 = document.getElementById('map2'); const playMap2Button = document.getElementById('playMap2Button'); if (playerData.megalodonDefeatedOn === 'normal' || playerData.megalodonDefeatedOn === 'jaws') { map2.classList.remove('locked'); playMap2Button.disabled = false; } else { map2.classList.add('locked'); playMap2Button.disabled = true; } }
function handleAuthSubmit() { const email = authEmail.value; const password = authPassword.value; authError.classList.add('hidden'); const action = isLoginMode ? auth.signInWithEmailAndPassword(email, password) : auth.createUserWithEmailAndPassword(email, password); action.then(userCredential => { console.log(isLoginMode ? "Успішний вхід:" : "Акаунт створено:", userCredential.user); showScreen('main'); }).catch(error => { authError.textContent = translations[gameState.currentLang].authError + error.message; authError.classList.remove('hidden'); }); }
function handleLogout() { auth.signOut().then(() => console.log("Користувач вийшов.")); }
function createMiniboss(type) { if (gameState.bossOnScreen || gameState.isPaused) return; gameState.bossOnScreen = true; createTarget(type, false, true); }
  