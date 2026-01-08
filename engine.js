/**
 * ENGINE.JS - Основна логіка гри та система трофеїв
 */

let gameTimer, spawnInterval;

// --- 1. ЗАПУСК ГРИ ТА РІВНІВ ---
function startGame() {
    const stage = MAP_DATA[gameState.mapId].stages[gameState.stageIdx];
    const settings = DIFFICULTY_SETTINGS[gameState.difficulty];

    gameState.active = true;
    gameState.score = 0;
    gameState.killCount = 0;
    gameState.hp = (gameState.difficulty === 'jaws') ? 5 : 10;
    gameState.timeLeft = settings.time;
    gameState.bossActive = false;

    // Візуал
    document.getElementById('gameContainer').style.backgroundImage = `url('${stage.bg}')`;
    document.getElementById('screen-renderer').classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');
    document.getElementById('playerHealthDisplay').classList.remove('hidden');
    
    updateUI();
    startLoops();
}

function startLoops() {
    clearInterval(gameTimer);
    clearInterval(spawnInterval);

    // Таймер зворотного відліку
    gameTimer = setInterval(() => {
        if (!gameState.active || gameState.paused) return;
        gameState.timeLeft--;
        document.getElementById('timerDisplay').textContent = `⏳ ${gameState.timeLeft}s`;
        if (gameState.timeLeft <= 0) endGame("Час вийшов! Безодня забрала вас.");
    }, 1000);

    // Спавн ворогів або боса
    spawnInterval = setInterval(() => {
        const stage = MAP_DATA[gameState.mapId].stages[gameState.stageIdx];
        if (!gameState.active || gameState.paused || gameState.bossActive) return;

        if (stage.enemies.length > 0) {
            createEnemy();
        } else if (stage.boss && !gameState.bossActive) {
            spawnBoss(stage.boss);
        }
    }, 1200);
}

// --- 2. ВОРОГИ ТА БОСИ ---
function createEnemy() {
    const container = document.getElementById('gameContainer');
    const stage = MAP_DATA[gameState.mapId].stages[gameState.stageIdx];
    const settings = DIFFICULTY_SETTINGS[gameState.difficulty];
    
    const enemy = document.createElement('img');
    enemy.src = `assets/${stage.enemies[Math.floor(Math.random() * stage.enemies.length)]}`;
    enemy.className = 'target';
    
    const fromLeft = Math.random() > 0.5;
    enemy.style.top = Math.random() * (window.innerHeight - 250) + 100 + 'px';
    let pos = fromLeft ? -150 : window.innerWidth + 50;
    enemy.style.left = pos + 'px';
    if (!fromLeft) enemy.style.transform = "scaleX(-1)"; 

    enemy.onclick = (e) => {
        e.stopPropagation();
        gameState.score += settings.points;
        gameState.killCount++;
        enemy.classList.add('dying');
        updateUI();
        
        // Поява боса (після 10 вбитих на 3-му етапі)
        if (stage.boss && gameState.killCount >= 10 && !gameState.bossActive) {
            spawnBoss(stage.boss);
        }

        setTimeout(() => enemy.remove(), 400);
        if (gameState.score >= 40 && !gameState.bossActive) winStage();
    };

    container.appendChild(enemy);
    
    let moveInt = setInterval(() => {
        if (!gameState.active || gameState.paused) return;
        if (!enemy.parentElement) return clearInterval(moveInt);
        
        pos += fromLeft ? settings.speed : -settings.speed;
        enemy.style.left = pos + 'px';

        if ((fromLeft && pos > window.innerWidth) || (!fromLeft && pos < -200)) {
            enemy.remove(); 
            takeDamage(); 
            clearInterval(moveInt);
        }
    }, 20);
}

function spawnBoss(bossImg) {
    if (gameState.bossActive) return;
    gameState.bossActive = true;
    
    const container = document.getElementById('gameContainer');
    const boss = document.createElement('img');
    boss.src = `assets/${bossImg}`;
    boss.className = 'target boss-img';
    boss.style.left = '50%'; 
    boss.style.top = '30%'; 
    boss.style.transform = 'translateX(-50%)';
    
    let bossHp = 25;
    boss.onclick = () => {
        bossHp--;
        boss.style.filter = "brightness(2) red";
        setTimeout(() => boss.style.filter = "", 100);
        
        if (bossHp <= 0) {
            boss.remove(); 
            gameState.bossActive = false; 
            winStage();
        }
    };
    container.appendChild(boss);
}

// --- 3. ЗДОРОВ'Я ТА ІНТЕРФЕЙС ---
function takeDamage() {
    if (gameState.invul || !gameState.active) return;
    gameState.hp--;
    updateUI();
    gameState.invul = true;
    document.getElementById('gameContainer').style.boxShadow = "inset 0 0 100px red";
    setTimeout(() => { 
        gameState.invul = false; 
        document.getElementById('gameContainer').style.boxShadow = ""; 
    }, 1000);

    if (gameState.hp <= 0) endGame("Ваш човен розтрощено! Гру закінчено.");
}

function updateUI() {
    const T = TRANSLATIONS[gameState.lang];
    const stage = MAP_DATA[gameState.mapId].stages[gameState.stageIdx];
    
    document.getElementById('hud-map-name').textContent = stage.name;
    document.getElementById('scoreDisplay').textContent = `${T.score}: ${Math.floor(gameState.score)} / 40`;
    document.getElementById('heart-container').textContent = '❤️'.repeat(gameState.hp);
}

// --- 4. ПЕРЕМОГА ТА ЛУТ ---
function winStage() {
    gameState.active = false;
    clearInterval(gameTimer);
    clearInterval(spawnInterval);

    const stage = MAP_DATA[gameState.mapId].stages[gameState.stageIdx];

    // СИСТЕМА ЛЕГЕНДАРНОГО ЛУТУ
    if (stage.boss) {
        let lootKey = null;
        if (gameState.mapId === 0) lootKey = 'tooth';    // 1 мапа - Зуб
        if (gameState.mapId === 1) lootKey = 'tentacle'; // 2 мапа - Щупальце
        if (gameState.mapId === 2) lootKey = 'tongue';   // 3 мапа - Язик

        if (lootKey) {
            playerProgress.inventory.push(lootKey);
            alert(`${gameState.lang === 'uk' ? 'Отримано:' : 'Obtained:'} ${LEGENDARY_ITEMS[lootKey].name}`);
        }

        // РОЗБЛОКУВАННЯ КРАМНИЦІ
        // Умова: Перемога над Кракеном (мапа id 1) на Normal
        if (gameState.mapId === 1 && gameState.difficulty === 'normal') {
            playerProgress.shopUnlocked = true;
            alert(gameState.lang === 'uk' ? "Крамниця Русалки тепер відкрита!" : "Mermaid's Shop is now unlocked!");
        }
    }

    saveGame();
    showVictoryScreen();
}

function endGame(msg) {
    gameState.active = false; 
    alert(msg); 
    location.reload();
}