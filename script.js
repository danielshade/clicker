/**
 * WATERY AGONY - Version 3.5 (Firebase Integrated)
 * Author: Danylo (Tinnik)
 */

// --- 1. CONFIGURATION & INITIALIZATION ---
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

const translations = {
    uk: {
        login: "Вхід", register: "Реєстрація", logout: "Вийти", authError: "Помилка: ", 
        authButton: "Увійти / Зареєструватися", gameTitle: "Водяна Агонія", startButton: "Старт",
        map: "Карта Світу", shop: "Магазин", about: "Персонажі", score: "Очки", 
        time: "Час", level: "Рівень", diffLabel: "Складність", playButton: "В БІЙ!",
        gameOver: "ГРУ ЗАВЕРШЕНО", finalWin: "ПЕРЕМОГА!", timeUp: "Час вийшов!",
        playerDied: "Корабель затонув!", finalScore: "Ваш рівень:", restartButton: "ГРАТИ ЗНОВУ",
        finalBossNotification: "Це він! Мегалодон! Помстися за мого брата!"
    },
    en: {
        login: "Login", register: "Register", logout: "Logout", authError: "Error: ", 
        authButton: "Login / Register", gameTitle: "Watery Agony", startButton: "Start",
        map: "World Map", shop: "Shop", about: "Characters", score: "Score", 
        time: "Time", level: "Level", diffLabel: "Difficulty", playButton: "TO BATTLE!",
        gameOver: "GAME OVER", finalWin: "VICTORY!", timeUp: "Time is up!",
        playerDied: "The boat has sunk!", finalScore: "You reached level:", restartButton: "PLAY AGAIN",
        finalBossNotification: "It's the Megalodon! Avenge my brother!"
    }
};

const difficultySettings = {
    easy:   { minSpeed: 0.8, maxSpeed: 1.5, spawnInterval: 1200, points: 3 },
    normal: { minSpeed: 1.5, maxSpeed: 2.5, spawnInterval: 900,  points: 1 },
    jaws:   { minSpeed: 2.5, maxSpeed: 4.0, spawnInterval: 600,  points: 0.33 }
};

const levelNames = {
    uk: ["Посейдон", "Ньйорд", "Варуна", "Собек", "МЕГАЛОДОН"],
    en: ["Poseidon", "Njörðr", "Varuna", "Sobek", "MEGALODON"]
};

const GOAL_SCORE = 50;
const sharkTypes = ['assets/shark_1.png', 'assets/shark_2.png', 'assets/shark_3.png'];
const megalodonHp = { easy: 38, normal: 50, jaws: 100 };

let gameState = {
    currentLevel: 0, score: 0, timeLeft: 120, playerHealth: 10,
    currentLang: 'uk', currentDifficulty: 'easy', isPaused: false,
    bossOnScreen: false, animationFrameId: null, intervals: [], activeTargets: [],
    isLoginMode: true
};

let playerData = { pearls: 0, megalodonDefeatedOn: null };

// --- 2. DOM ELEMENTS CACHING ---
const elements = {};
const elementIds = [
    'mainMenuScreen', 'setupScreen', 'mapScreen', 'shopScreen', 'gameOverScreen', 
    'pauseScreen', 'authScreen', 'uiContainer', 'inGameControls', 'playerHealthDisplay',
    'authEmail', 'authPassword', 'authError', 'authSubmitButton', 'loginTab', 'registerTab',
    'userInfo', 'userEmail', 'logoutButton', 'authButton', 'startButton', 'mapButton', 
    'mainMenuShopButton', 'scoreDisplay', 'timerDisplay', 'levelDisplay', 'stanley-notification',
    'notification-text', 'gameContainer'
];

document.addEventListener('DOMContentLoaded', () => {
    elementIds.forEach(id => elements[id] = document.getElementById(id));
    
    loadPlayerData();
    attachEventListeners();
    initAuthState();
    updateUIText();
    showScreen('main');
});

// --- 3. AUTHENTICATION LOGIC ---
function initAuthState() {
    auth.onAuthStateChanged(user => {
        const { userInfo, authButton, startButton, mapButton, mainMenuShopButton, userEmail } = elements;
        const gameButtons = [startButton, mapButton, mainMenuShopButton];

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
}

function handleAuthSubmit() {
    const email = elements.authEmail.value;
    const password = elements.authPassword.value;
    elements.authError.classList.add('hidden');

    const authAction = gameState.isLoginMode 
        ? auth.signInWithEmailAndPassword(email, password)
        : auth.createUserWithEmailAndPassword(email, password);

    authAction
        .then(() => showScreen('main'))
        .catch(error => {
            elements.authError.textContent = translations[gameState.currentLang].authError + error.message;
            elements.authError.classList.remove('hidden');
        });
}

function handleLogout() {
    auth.signOut().then(() => console.log("User logged out."));
}

function switchAuthTab(mode) {
    gameState.isLoginMode = (mode === 'login');
    elements.loginTab.classList.toggle('selected', gameState.isLoginMode);
    elements.registerTab.classList.toggle('selected', !gameState.isLoginMode);
    updateUIText();
}

// --- 4. UI MANAGEMENT ---
function showScreen(screenName) {
    const screens = ['main', 'setup', 'map', 'shop', 'gameover', 'pause', 'auth'];
    screens.forEach(s => elements[s + 'Screen']?.classList.add('hidden'));
    
    // Hide UI during menus
    if (screenName !== 'none') {
        elements.uiContainer.classList.add('hidden');
        elements.inGameControls.classList.add('hidden');
        elements.playerHealthDisplay.classList.add('hidden');
    }

    if (elements[screenName + 'Screen']) {
        elements[screenName + 'Screen'].classList.remove('hidden');
    }
}

function updateUIText() {
    const T = translations[gameState.currentLang];
    const isLogin = gameState.isLoginMode;

    elements.authButton.textContent = T.authButton;
    elements.loginTab.textContent = T.login;
    elements.registerTab.textContent = T.register;
    elements.authSubmitButton.textContent = isLogin ? T.login : T.register;
    elements.logoutButton.textContent = T.logout;
    // ... add more translations as needed
}

// --- 5. GAME ENGINE ---
function startGame() {
    showScreen('none');
    elements.uiContainer.classList.remove('hidden');
    elements.inGameControls.classList.remove('hidden');
    elements.playerHealthDisplay.classList.remove('hidden');
    
    gameState.playerHealth = 10;
    gameState.currentLevel = 0;
    startLevel();
    if (!gameState.animationFrameId) gameLoop();
}

function startLevel() {
    if (gameState.currentLevel === 4) return triggerFinalBossSequence();

    stopGameActivity(false);
    gameState.bossOnScreen = false;
    gameState.score = 0;
    gameState.timeLeft = 120;
    
    updateGameUI();
    const diff = difficultySettings[gameState.currentDifficulty];
    
    gameState.intervals.push(setInterval(createTarget, diff.spawnInterval));
    gameState.intervals.push(setInterval(updateTimer, 1000));
    
    if (gameState.currentLevel >= 2) {
        gameState.intervals.push(setTimeout(createMiniboss, 8000 + Math.random() * 5000));
    }
}

function createTarget(isMiniboss = false, isFinalBoss = false) {
    if (gameState.isPaused) return;

    const element = document.createElement('img');
    const target = { element, isMiniboss, isFinalBoss };

    if (isFinalBoss) {
        element.src = 'assets/megalodon.png';
        element.className = 'target finalboss';
        target.hp = megalodonHp[gameState.currentDifficulty];
        target.maxHp = target.hp;
        target.pattern = 'vertical';
    } else if (isMiniboss) {
        element.src = 'assets/white_shark.png';
        element.className = 'target miniboss';
        target.hp = 20;
        target.maxHp = 20;
        target.pattern = 'horizontal';
    } else {
        element.src = sharkTypes[Math.floor(Math.random() * sharkTypes.length)];
        element.className = 'target';
        target.pattern = ['horizontal', 'diagonal', 'wavy'][Math.floor(Math.random() * 3)];
    }

    // Health Bar for Big Guys
    if (isMiniboss || isFinalBoss) {
        const container = document.createElement('div');
        container.className = 'health-bar-container';
        const bar = document.createElement('div');
        bar.className = 'health-bar';
        container.appendChild(bar);
        element.appendChild(container);
        target.healthBar = bar;
    }

    setupMovement(target);
    
    element.addEventListener('click', () => handleTargetClick(target));
    elements.gameContainer.appendChild(element);
    gameState.activeTargets.push(target);
}

function handleTargetClick(target) {
    if (gameState.isPaused) return;

    if (target.isMiniboss || target.isFinalBoss) {
        target.hp--;
        target.healthBar.style.width = `${(target.hp / target.maxHp) * 100}%`;
        if (target.hp <= 0) {
            destroyTarget(target);
            if (target.isFinalBoss) endGame(true, "", true);
            else { gameState.score += 10; gameState.bossOnScreen = false; }
        }
    } else {
        gameState.score += difficultySettings[gameState.currentDifficulty].points;
        destroyTarget(target);
    }
    
    updateGameUI();
    if (!target.isMiniboss && !target.isFinalBoss && gameState.score >= GOAL_SCORE) {
        gameState.currentLevel++;
        startLevel();
    }
}

function destroyTarget(target) {
    target.element.classList.add('dying');
    setTimeout(() => target.element.remove(), 300);
    gameState.activeTargets = gameState.activeTargets.filter(t => t !== target);
}

// --- 6. UTILS ---
function stopGameActivity(clearScreen) {
    gameState.intervals.forEach(clearInterval);
    gameState.intervals.forEach(clearTimeout);
    gameState.intervals = [];
    if (clearScreen) {
        gameState.activeTargets.forEach(t => t.element.remove());
        gameState.activeTargets = [];
    }
}

function updateGameUI() {
    const T = translations[gameState.currentLang];
    elements.playerHealthDisplay.textContent = `❤️ ${Math.max(0, gameState.playerHealth)}`;
    elements.scoreDisplay.textContent = `${T.score}: ${Math.floor(gameState.score)} / ${GOAL_SCORE}`;
    elements.timerDisplay.textContent = `${T.time}: ${gameState.timeLeft}`;
    elements.levelDisplay.textContent = `${T.level}: ${levelNames[gameState.currentLang][gameState.currentLevel]}`;
}

function attachEventListeners() {
    elements.authButton.onclick = () => { switchAuthTab('login'); showScreen('auth'); };
    elements.authBackButton.onclick = () => showScreen('main');
    elements.loginTab.onclick = () => switchAuthTab('login');
    elements.registerTab.onclick = () => switchAuthTab('register');
    elements.authSubmitButton.onclick = handleAuthSubmit;
    elements.logoutButton.onclick = handleLogout;
    // ... add your existing game listeners here
}

function loadPlayerData() {
    const data = localStorage.getItem('wateryAgonyData');
    if (data) playerData = JSON.parse(data);
}

function savePlayerData() {
    localStorage.setItem('wateryAgonyData', JSON.stringify(playerData));
}