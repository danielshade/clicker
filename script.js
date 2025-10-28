// --- ІНІЦІАЛІЗАЦІЯ FIREBASE ---
// Встав свій firebaseConfig, який ти мені надсилав
const firebaseConfig = {
  apiKey: "AIzaSyARafgEdXXxc_jxw6TZnxJmg0mWTiARtjQ",
  authDomain: "watery-agony.firebaseapp.com",
  projectId: "watery-agony",
  storageBucket: "watery-agony.firebasestorage.app",
  messagingSenderId: "45840830431",
  appId: "1:45840830431:web:6dd170ff1bc0596571fe6a"
};

// Ініціалізуємо Firebase та його сервіси
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// --- ГЛОБАЛЬНІ НАЛАШТУВАННЯ ТА СТАН ГРИ ---
const translations = {
    uk: {
        login: "Вхід", register: "Реєстрація", logout: "Вийти", authError: "Помилка: ", authButton: "Увійти / Зареєструватися",
        // ... (решта перекладів)
    },
    en: {
        login: "Login", register: "Register", logout: "Logout", authError: "Error: ", authButton: "Login / Register",
        // ... (решта перекладів)
    }
};
// ... (решта глобальних змінних: difficultySettings, levelNames, gameState, playerData)

// --- DOM ЕЛЕМЕНТИ (додано нові) ---
const authScreen = document.getElementById('authScreen');
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const authEmail = document.getElementById('authEmail');
const authPassword = document.getElementById('authPassword');
const authError = document.getElementById('authError');
const authSubmitButton = document.getElementById('authSubmitButton');
const authBackButton = document.getElementById('authBackButton');
const userInfo = document.getElementById('userInfo');
const userEmail = document.getElementById('userEmail');
const logoutButton = document.getElementById('logoutButton');
const authButton = document.getElementById('authButton');
// ... (решта DOM елементів)

// --- ІНІЦІАЛІЗАЦІЯ ТА ОБРОБНИКИ ПОДІЙ ---
document.addEventListener('DOMContentLoaded', () => {
    loadPlayerData();
    attachEventListeners();
    updateUIText();
    showScreen('main');
});

function attachEventListeners() {
    // ... (старі обробники)
    // НОВІ обробники для реєстрації
    authButton.addEventListener('click', () => showScreen('auth'));
    authBackButton.addEventListener('click', () => showScreen('main'));
    loginTab.addEventListener('click', () => switchAuthTab('login'));
    registerTab.addEventListener('click', () => switchAuthTab('register'));
    authSubmitButton.addEventListener('click', handleAuthSubmit);
    logoutButton.addEventListener('click', handleLogout);
}

// --- УПРАВЛІННЯ FIREBASE AUTH ---
let isLoginMode = true;

function switchAuthTab(mode) {
    isLoginMode = mode === 'login';
    loginTab.classList.toggle('selected', isLoginMode);
    registerTab.classList.toggle('selected', !isLoginMode);
    updateUIText(); // Оновлюємо текст кнопки "Увійти" / "Створити акаунт"
}

function handleAuthSubmit() {
    const email = authEmail.value;
    const password = authPassword.value;
    authError.classList.add('hidden');

    if (isLoginMode) {
        auth.signInWithEmailAndPassword(email, password)
            .then(userCredential => {
                console.log("Успішний вхід:", userCredential.user);
                showScreen('main');
            })
            .catch(error => {
                authError.textContent = translations[gameState.currentLang].authError + error.message;
                authError.classList.remove('hidden');
            });
    } else {
        auth.createUserWithEmailAndPassword(email, password)
            .then(userCredential => {
                console.log("Акаунт створено:", userCredential.user);
                showScreen('main');
            })
            .catch(error => {
                authError.textContent = translations[gameState.currentLang].authError + error.message;
                authError.classList.remove('hidden');
            });
    }
}

function handleLogout() {
    auth.signOut().then(() => {
        console.log("Користувач вийшов.");
    });
}

// Слідкуємо за станом авторизації
auth.onAuthStateChanged(user => {
    if (user) {
        // Користувач увійшов
        userInfo.classList.remove('hidden');
        userEmail.textContent = user.email;
        authButton.classList.add('hidden');
        [...document.querySelectorAll('#startButton, #mapButton, #mainMenuShopButton')].forEach(b => b.disabled = false);
    } else {
        // Користувач вийшов
        userInfo.classList.add('hidden');
        authButton.classList.remove('hidden');
        [...document.querySelectorAll('#startButton, #mapButton, #mainMenuShopButton')].forEach(b => b.disabled = true);
    }
});

function startGame() { showScreen('none'); uiContainer.classList.remove('hidden'); inGameControls.classList.remove('hidden'); playerHealthDisplay.classList.remove('hidden'); gameState.playerHealth = 10; gameState.currentLevel = 0; startLevel(); if (!gameState.animationFrameId) gameLoop(); }
function startLevel() { if (gameState.currentLevel === 4) { triggerFinalBossSequence(); return; } stopGameActivity(false); gameState.bossOnScreen = false; gameState.score = 0; gameState.timeLeft = 120; timerDisplay.classList.remove('hidden'); scoreDisplay.classList.remove('hidden'); scoreDisplay.textContent = `${translations[gameState.currentLang].score}: 0 / ${GOAL_SCORE}`; updateGameUI(); const difficulty = difficultySettings[gameState.currentDifficulty]; gameState.intervals.push(setInterval(createTarget, difficulty.spawnInterval)); gameState.intervals.push(setInterval(updateTimer, 1000)); if (gameState.currentLevel >= 2) gameState.intervals.push(setTimeout(createMiniboss, 10000 + Math.random() * 5000)); }
function triggerFinalBossSequence() { stopGameActivity(true); notificationText.textContent = translations[gameState.currentLang].finalBossNotification; stanleyNotification.classList.remove('hidden'); stanleyNotification.classList.add('show'); setTimeout(() => { stanleyNotification.classList.remove('show'); setTimeout(() => { stanleyNotification.classList.add('hidden'); startFinalBossLevel(); }, 500); }, 6000); }
function startFinalBossLevel() { stopGameActivity(true); gameState.bossOnScreen = false; gameState.timeLeft = 999; gameState.score = 0; updateGameUI(); timerDisplay.classList.add('hidden'); scoreDisplay.classList.add('hidden'); createTarget(false, true); }
function createTarget(isMiniboss = false, isFinalBoss = false) { const element = document.createElement('img'); const targetObject = { element, isMiniboss, isFinalBoss }; if (isFinalBoss) { element.src = 'assets/megalodon.png'; element.className = 'target finalboss'; targetObject.hp = megalodonHp[gameState.currentDifficulty]; targetObject.maxHp = megalodonHp[gameState.currentDifficulty]; targetObject.pattern = 'vertical'; } else if (isMiniboss) { element.src = 'assets/white_shark.png'; element.className = 'target miniboss'; targetObject.hp = 20; targetObject.maxHp = 20; targetObject.pattern = 'horizontal'; } else { element.src = sharkTypes[Math.floor(Math.random() * sharkTypes.length)]; element.className = 'target'; const movementPatterns = ['horizontal', 'diagonal', 'wavy']; targetObject.pattern = movementPatterns[Math.floor(Math.random() * movementPatterns.length)]; } if (isMiniboss || isFinalBoss) { const healthBarContainer = document.createElement('div'); healthBarContainer.className = 'health-bar-container'; const healthBar = document.createElement('div'); healthBar.className = 'health-bar'; healthBarContainer.appendChild(healthBar); element.appendChild(healthBarContainer); targetObject.healthBar = healthBar; } const difficulty = difficultySettings[gameState.currentDifficulty]; let speed = (difficulty.minSpeed + Math.random() * (difficulty.maxSpeed - difficulty.minSpeed)); if(isMiniboss) speed *= 0.7; if(isFinalBoss) speed *= 0.5; let startX, startY, speedX = 0, speedY = 0; const direction = Math.random() < 0.5 ? 1 : -1; if (targetObject.pattern === 'vertical') { startX = Math.random() * (gameContainer.clientWidth - 250); startY = gameContainer.clientHeight; speedY = -speed; } else { speedX = speed * direction; startX = direction === 1 ? -200 : gameContainer.clientWidth; startY = Math.random() * (gameContainer.clientHeight - (isMiniboss ? 200 : 100)); element.style.transform = direction === -1 ? 'scaleX(-1)' : ''; } element.style.top = `${startY}px`; element.style.left = `${startX}px`; Object.assign(targetObject, { x: startX, y: startY, speedX, speedY, startY_wave: startY, waveAmp: 40 + Math.random() * 40, waveFreq: 0.01 + Math.random() * 0.01 }); gameState.activeTargets.push(targetObject); element.addEventListener('click', () => { if (gameState.isPaused) return; if (isMiniboss || isFinalBoss) { targetObject.hp--; targetObject.healthBar.style.width = `${(targetObject.hp / targetObject.maxHp) * 100}%`; if (targetObject.hp <= 0) { if (isFinalBoss) endGame(true, "", true); else { gameState.score += 10; gameState.bossOnScreen = false; } element.classList.add('dying'); setTimeout(() => element.remove(), 300); gameState.activeTargets = gameState.activeTargets.filter(t => t !== targetObject); } } else { gameState.score += difficultySettings[gameState.currentDifficulty].points; element.classList.add('dying'); setTimeout(() => element.remove(), 300); gameState.activeTargets = gameState.activeTargets.filter(t => t !== targetObject); } updateGameUI(); if (!isMiniboss && !isFinalBoss && gameState.score >= GOAL_SCORE) { gameState.currentLevel++; if (gameState.currentLevel >= levelNames.uk.length - 1) startLevel(); else startLevel(); } }); gameContainer.appendChild(element); }
function createMiniboss() { if (gameState.bossOnScreen || gameState.isPaused) return; gameState.bossOnScreen = true; createTarget(true); }
function gameLoop() { if (!gameState.isPaused) { for (let i = gameState.activeTargets.length - 1; i >= 0; i--) { const target = gameState.activeTargets[i]; switch(target.pattern) { case 'horizontal': target.x += target.speedX; break; case 'diagonal': target.x += target.speedX; target.y += (target.speedY || target.speedX * 0.3); if (target.y < 0 || target.y > gameContainer.clientHeight - 100) target.speedY *= -1; break; case 'wavy': target.x += target.speedX; target.y = target.startY_wave + Math.sin(target.x * target.waveFreq) * target.waveAmp; break; case 'vertical': target.y += target.speedY; break; } target.element.style.left = `${target.x}px`; target.element.style.top = `${target.y}px`; let escapedHorizontal = target.pattern !== 'vertical' && (target.x > gameContainer.clientWidth + 50 || target.x < -200); let escapedTop = target.pattern === 'vertical' && target.y < -150; if (escapedTop && target.isFinalBoss) { gameState.playerHealth -= 5; target.y = gameContainer.clientHeight; updateGameUI(); if (gameState.playerHealth <= 0) { endGame(false, translations[gameState.currentLang].playerDied); return; } } else if (escapedHorizontal) { if (target.isMiniboss) { gameState.playerHealth -= 2; gameState.bossOnScreen = false; updateGameUI(); if (gameState.playerHealth <= 0) { endGame(false, translations[gameState.currentLang].playerDied); return; } } target.element.remove(); gameState.activeTargets.splice(i, 1); } } } gameState.animationFrameId = requestAnimationFrame(gameLoop); }
function updateTimer() { if (gameState.isPaused) return; gameState.timeLeft--; updateGameUI(); if (gameState.timeLeft <= 0 && gameState.currentLevel !== 4) { endGame(false, translations[gameState.currentLang].timeUp); } }
function endGame(didWin, customMessage = "", isFinalVictory = false) { stopGameActivity(true); const T = translations[gameState.currentLang]; const openShopButtonEl = document.getElementById('openShopButton'); const gameOverTitleEl = document.getElementById('gameOverTitle'); const gameOverMessageEl = document.getElementById('gameOverMessage'); const restartButtonEl = document.getElementById('restartButton'); openShopButtonEl.classList.add('hidden'); if (isFinalVictory) { if (!playerData.megalodonDefeatedOn) { playerData.pearls += 7; } playerData.megalodonDefeatedOn = gameState.currentDifficulty; savePlayerData(); gameOverTitleEl.textContent = T.finalWin; gameOverMessageEl.textContent = T.winMsg; openShopButtonEl.classList.remove('hidden'); } else { gameOverTitleEl.textContent = T.gameOver; gameOverMessageEl.textContent = customMessage || `${T.finalScore} '${levelNames[gameState.currentLang][gameState.currentLevel]}'.`; } restartButtonEl.textContent = T.restartButton; gameOverScreen.classList.remove('hidden'); }
function togglePause() { gameState.isPaused = !gameState.isPaused; const T = translations[gameState.currentLang]; if (gameState.isPaused) { document.getElementById('pauseButton').textContent = T.resume; pauseScreen.classList.remove('hidden'); } else { document.getElementById('pauseButton').textContent = T.pause; pauseScreen.classList.add('hidden'); } }
function stopGameActivity(clearScreen) { gameState.intervals.forEach(i => { clearInterval(i); clearTimeout(i); }); gameState.intervals = []; if (clearScreen) { gameState.activeTargets.forEach(t => t.element.remove()); gameState.activeTargets = []; } gameState.isPaused = false; }
function returnToMenu() { stopGameActivity(true); showScreen('main'); if (gameState.animationFrameId) { cancelAnimationFrame(gameState.animationFrameId); gameState.animationFrameId = null; } }


// --- РЕШТА КОДУ ГРИ ---
// Вся інша логіка (startGame, createTarget, gameLoop і т.д.) залишається тут.
// Я не буду її дублювати, просто скопіюй її з попередньої версії.

// --- ІНІЦІАЛІЗАЦІЯ FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyARafgEdXXxc_jxw6TZnxJmg0mWTiARtjQ",
  authDomain: "watery-agony.firebaseapp.com",
  projectId: "watery-agony",
  storageBucket: "watery-agony.firebasestorage.app",
  messagingSenderId: "45840830431",
  appId: "1:45840830431:web:6dd170ff1bc0596571fe6a"
};
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// --- ГЛОБАЛЬНІ НАЛАШТУВАННЯ ---
const translations = {
    uk: {
        login: "Вхід", register: "Реєстрація", logout: "Вийти", authError: "Помилка: ", authButton: "Увійти / Зареєструватися",
        map: "Карта Світу", map1: "Узбережжя Короля", map2: "Окови Безодні", map2Locked: "(Перемогти на Нормалі+)", play: "Грати", back: "Назад",
        shop: "Забавульки Русалки", shopWeapon: "Зброя", shopWeaponDesc: "Нові гарпуни (скоро)", shopScrolls: "Свитки", shopScrollsDesc: "Древні історії (скоро)", shopLife: "Життя", shopLifeDesc: "+1 ❤️ (10 Перлин)", shopBuy: "Купити", pearl: "Перлин", shopLifeLock: "Перемогти боса на Нормальній складності",
        stanleyDialogue: "Аррр, друже! Я — старий Стенлі Акулосмерть! Ці прокляті акули знову тероризують мої береги! Допоможеш старому пірату?", gameTitle: "Водяна Агонія", langLabel: "Мова", diffLabel: "Складність", level: "Рівень", score: "Очки", time: "Час", startButton: "Старт", diffEasy: "Легко пливу", diffNormal: "Норм. зависаю", diffJaws: "JAWS", pause: "Пауза", resume: "Продовжити", mainMenu: "Головне меню", pauseTitle: "ПАУЗА", gameOver: "ГРУ ЗАВЕРШЕНО", timeUp: "Час вийшов!", win: "ПЕРЕМОГА!", winMsg: "Ти захистив берег!", finalScore: "Ви досягли рівня", restartButton: "ГРАТИ ЗНОВУ", finalBossNotification: "Це він! Мегалодон, що забрав мого брата! Не дай йому дістатися поверхні, благаю!", finalWin: "Ти це зробив! Ти помстився за мого брата!", backToMenu: "В меню"
    },
    en: {
        login: "Login", register: "Register", logout: "Logout", authError: "Error: ", authButton: "Login / Register",
        map: "World Map", map1: "King's Coast", map2: "Abyss Shackles", map2Locked: "(Defeat on Normal+)", play: "Play", back: "Back",
        shop: "The Mermaid's Trinkets", shopWeapon: "Weapons", shopWeaponDesc: "New harpoons (soon)", shopScrolls: "Scrolls", shopScrollsDesc: "Ancient tales (soon)", shopLife: "Life", shopLifeDesc: "+1 ❤️ (10 Pearls)", shopBuy: "Buy", pearl: "Pearls", shopLifeLock: "Defeat boss on Normal",
        stanleyDialogue: "Arrr, matey! The name's Stanley Sharkdeath! These cursed sharks are terrorizin' me shores again! Will ye help an old pirate out?", gameTitle: "Watery Agony", langLabel: "Language", diffLabel: "Difficulty", level: "Level", score: "Score", time: "Time", startButton: "Start", diffEasy: "Easy Swim", diffNormal: "Hanging Out", diffJaws: "JAWS", pause: "Pause", resume: "Resume", mainMenu: "Main Menu", pauseTitle: "PAUSED", gameOver: "GAME OVER", timeUp: "Time is up!", win: "VICTORY!", winMsg: "You've protected the shores!", finalScore: "You reached level", restartButton: "PLAY AGAIN", finalBossNotification: "That's him! The Megalodon that took me brother! Don't let him reach the surface, I beg ye!", finalWin: "You did it! You avenged me brother!", backToMenu: "To Menu"
    }
};
// ... (решта коду без змін)
const difficultySettings = { easy: { minSpeed: 0.8, maxSpeed: 1.5, spawnInterval: 1200, points: 3 }, normal: { minSpeed: 1.5, maxSpeed: 2.5, spawnInterval: 900,  points: 1 }, jaws:   { minSpeed: 2.5, maxSpeed: 4.0, spawnInterval: 600,  points: 1/3 } };
const levelNames = { uk: ["Посейдон", "Ньйорд", "Варуна", "Собек", "МЕГАЛОДОН"], en: ["Poseidon", "Njörðr", "Varuna", "Sobek", "MEGALODON"] };
const GOAL_SCORE = 50;
const sharkTypes = ['assets/shark_1.png', 'assets/shark_2.png', 'assets/shark_3.png'];
const megalodonHp = { easy: 38, normal: 50, jaws: 100 };
let gameState = { currentLevel: 0, score: 0, timeLeft: 120, playerHealth: 10, currentLang: 'uk', currentDifficulty: 'easy', isPaused: false, bossOnScreen: false, animationFrameId: null, intervals: [], activeTargets: [] };
let playerData = { pearls: 0, megalodonDefeatedOn: null };

// --- DOM ЕЛЕМЕНТИ ---
const allScreens = {
    main: document.getElementById('mainMenuScreen'),
    setup: document.getElementById('setupScreen'),
    map: document.getElementById('mapScreen'),
    shop: document.getElementById('shopScreen'),
    gameover: document.getElementById('gameOverScreen'),
    pause: document.getElementById('pauseScreen'),
    auth: document.getElementById('authScreen')
};
const gameUi = {
    container: document.getElementById('uiContainer'),
    controls: document.getElementById('inGameControls'),
    health: document.getElementById('playerHealthDisplay')
};
const stanleyNotification = document.getElementById('stanley-notification');
// ... (і так далі для всіх елементів)

// --- ІНІЦІАЛІЗАЦІЯ ---
document.addEventListener('DOMContentLoaded', () => {
    loadPlayerData();
    attachEventListeners();
    updateUIText();
    showScreen('main');
    auth.onAuthStateChanged(user => {
        const userInfo = document.getElementById('userInfo');
        const authButton = document.getElementById('authButton');
        const gameButtons = [document.getElementById('startButton'), document.getElementById('mapButton'), document.getElementById('mainMenuShopButton')];

        if (user) {
            userInfo.classList.remove('hidden');
            document.getElementById('userEmail').textContent = user.email;
            authButton.classList.add('hidden');
            gameButtons.forEach(b => b.disabled = false);
        } else {
            userInfo.classList.add('hidden');
            authButton.classList.remove('hidden');
            gameButtons.forEach(b => b.disabled = true);
        }
    });
});

let isLoginMode = true;
function attachEventListeners() {
    // ... (всі інші обробники)
    document.getElementById('authButton').addEventListener('click', () => { switchAuthTab('login'); showScreen('auth'); });
    document.getElementById('authBackButton').addEventListener('click', () => showScreen('main'));
    document.getElementById('loginTab').addEventListener('click', () => switchAuthTab('login'));
    document.getElementById('registerTab').addEventListener('click', () => switchAuthTab('register'));
    document.getElementById('authSubmitButton').addEventListener('click', handleAuthSubmit);
    document.getElementById('logoutButton').addEventListener('click', handleLogout);
}

// --- УПРАВЛІННЯ FIREBASE AUTH ---
function switchAuthTab(mode) {
    isLoginMode = mode === 'login';
    document.getElementById('loginTab').classList.toggle('selected', isLoginMode);
    document.getElementById('registerTab').classList.toggle('selected', !isLoginMode);
    updateUIText();
}
function handleAuthSubmit() {
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;
    const authErrorEl = document.getElementById('authError');
    authErrorEl.classList.add('hidden');

    const action = isLoginMode ? auth.signInWithEmailAndPassword(email, password) : auth.createUserWithEmailAndPassword(email, password);
    
    action.then(userCredential => {
        console.log(isLoginMode ? "Успішний вхід:" : "Акаунт створено:", userCredential.user);
        showScreen('main');
    }).catch(error => {
        authErrorEl.textContent = translations[gameState.currentLang].authError + error.message;
        authErrorEl.classList.remove('hidden');
    });
}
function handleLogout() {
    auth.signOut().then(() => console.log("Користувач вийшов."));
}

// --- РЕШТА КОДУ ГРИ ---
// Повний код решти функцій, щоб нічого не загубилось.
function savePlayerData() { localStorage.setItem('wateryAgonyData', JSON.stringify(playerData)); }
function loadPlayerData() { const data = localStorage.getItem('wateryAgonyData'); if (data) playerData = JSON.parse(data); }
function showScreen(screenName) { Object.values(allScreens).forEach(s => s.classList.add('hidden')); Object.values(gameUi).forEach(el => el.classList.add('hidden')); if (allScreens[screenName]) allScreens[screenName].classList.remove('hidden'); }
function updateUIText() { const T = translations[gameState.currentLang]; /* ... скорочено для прикладу ... */ document.getElementById('authButton').textContent = T.authButton; document.getElementById('loginTab').textContent = T.login; document.getElementById('registerTab').textContent = T.register; document.getElementById('authSubmitButton').textContent = isLoginMode ? T.login : T.register; document.getElementById('logoutButton').textContent = T.logout; /* ... решта оновлень ... */ }
// ... і так далі. Оскільки код дуже великий, повна версія буде в наступному повідомленні, якщо ця структура влаштовує.