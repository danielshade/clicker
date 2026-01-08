/**
 * ENGINE.JS
 */

let gameTimer, spawnInterval;

function startGame() {
    const stage = MAP_DATA[gameState.mapId].stages[gameState.stageIdx];
    const settings = DIFFICULTY_SETTINGS[gameState.difficulty];

    gameState.active = true;
    gameState.score = 0;
    gameState.killCount = 0;
    gameState.hp = (gameState.difficulty === 'jaws') ? 5 : 10;
    gameState.timeLeft = settings.time;
    gameState.bossActive = false;

    // Встановлюємо фон
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

    gameTimer = setInterval(() => {
        if (!gameState.active || gameState.paused) return;
        gameState.timeLeft--;
        document.getElementById('timerDisplay').textContent = `⏳ ${gameState.timeLeft}s`;
        if (gameState.timeLeft <= 0) endGame("Час вийшов!");
    }, 1000);

    spawnInterval = setInterval(() => {
        const stage = MAP_DATA[gameState.mapId].stages[gameState.stageIdx];
        if (!gameState.active || gameState.paused || gameState.bossActive) return;

        if (stage.enemies.length > 0) createEnemy();
        else if (stage.boss && !gameState.bossActive) spawnBoss(stage.boss);
    }, 1200);
}

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
        
        if (stage.boss && gameState.killCount >= 10 && !gameState.bossActive) spawnBoss(stage.boss);

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
            enemy.remove(); takeDamage(); clearInterval(moveInt);
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
    boss.style.left = '50%'; boss.style.top = '30%'; boss.style.transform = 'translateX(-50%)';
    
    let bossHp = 25;
    boss.onclick = () => {
        bossHp--;
        boss.style.filter = "brightness(2) red";
        setTimeout(() => boss.style.filter = "", 100);
        if (bossHp <= 0) {
            boss.remove(); gameState.bossActive = false; winStage();
        }
    };
    container.appendChild(boss);
}

function takeDamage() {
    if (gameState.invul || !gameState.active) return;
    gameState.hp--;
    updateUI();
    gameState.invul = true;
    document.getElementById('gameContainer').style.boxShadow = "inset 0 0 100px red";
    setTimeout(() => { gameState.invul = false; document.getElementById('gameContainer').style.boxShadow = ""; }, 1000);
    if (gameState.hp <= 0) endGame("Гру закінчено!");
}

function updateUI() {
    const T = TRANSLATIONS[gameState.lang];
    document.getElementById('hud-map-name').textContent = MAP_DATA[gameState.mapId].stages[gameState.stageIdx].name;
    document.getElementById('scoreDisplay').textContent = `${T.score}: ${Math.floor(gameState.score)} / 40`;
    document.getElementById('heart-container').textContent = '❤️'.repeat(gameState.hp);
}

function winStage() {
    gameState.active = false;
    clearInterval(gameTimer); clearInterval(spawnInterval);
    showVictoryScreen();
}

function endGame(msg) {
    gameState.active = false; alert(msg); location.reload();
}