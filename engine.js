/*/**
 * ENGINE.JS - Оновлення 6.5.1: Фікс спавну босів та стабілізація
 * Поєднує Лавкрафтіанську атмосферу та виправлену логіку рівнів.
 */

let gameTimer, spawnInterval;
let watchUsedInGame = false; // Глобальний прапор для годинника

// --- 1. ЗАПУСК ГРИ ТА РІВНІВ ---
function startGame() {
    const stage = MAP_DATA[gameState.mapId].stages[gameState.stageIdx];
    const settings = DIFFICULTY_SETTINGS[gameState.difficulty];
    
    // Візуал HUD
    document.getElementById('pauseBtn').classList.remove('hidden');
    document.getElementById('gameContainer').style.backgroundImage = `url('${stage.bg}')`;
    document.getElementById('screen-renderer').classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');
    document.getElementById('playerHealthDisplay').classList.remove('hidden');

    // Скидання стану сесії
    gameState.active = true;
    gameState.paused = false;
    gameState.score = 0;
    gameState.killCount = 0;
    gameState.hp = (gameState.difficulty === 'jaws') ? 5 : 10;
    gameState.timeLeft = settings.time; 
    gameState.bossActive = false;

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
        const timerDisp = document.getElementById('timerDisplay');
        timerDisp.textContent = `⏳ ${gameState.timeLeft}s`;
        
        if (gameState.timeLeft <= 10) {
            timerDisp.style.color = "red";
            timerDisp.style.textShadow = "0 0 10px red";
        } else {
            timerDisp.style.color = "white";
            timerDisp.style.textShadow = "none";
        }

        if (gameState.timeLeft <= 0) endGame("Час вийшов!");
    }, 1000);

    // Основний цикл спавну (Фікс 6.5.1)
    spawnInterval = setInterval(() => {
        const stage = MAP_DATA[gameState.mapId].stages[gameState.stageIdx];
        if (!gameState.active || gameState.paused || gameState.bossActive) return;

        if (stage.enemies && stage.enemies.length > 0) {
            // Якщо є звичайні вороги - спавнимо їх
            createEnemy();
        } else if (stage.boss && !gameState.bossActive) {
            // ФІКС: Якщо масив ворогів порожній (чистий бос-рівень) - спавнимо боса негайно
            spawnBoss(stage.boss);
        }
    }, 1200);
}

// --- 2. ПРЕДМЕТИ (Годинник) ---
function useWatchBonus() {
    if (watchUsedInGame) return; 
    
    gameState.timeLeft += 20;
    watchUsedInGame = true; 
    
    const timerDisp = document.getElementById('timerDisplay');
    timerDisp.style.color = "#00ffcc";
    timerDisp.style.transform = "scale(1.5)";
    
    console.log("Watch used: +20s");
    
    setTimeout(() => {
        timerDisp.style.transform = "scale(1)";
        updateUI(); 
    }, 1000);
}

// --- 3. ВОРОГИ ТА БОСИ ---
function createEnemy() {
    const container = document.getElementById('gameContainer');
    const stage = MAP_DATA[gameState.mapId].stages[gameState.stageIdx];
    
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
        if (!gameState.active || gameState.paused) return;

        killEnemy(enemy);

        // Мачета (Мульти-кілл)
        if (gameState.weapon === 'machete') {
            const targets = Array.from(document.querySelectorAll('.target:not(.dying):not(.boss-img)'));
            const limit = (gameState.difficulty === 'jaws') ? 1 : 2; 
            for (let i = 0; i < limit; i++) {
                if (targets[i]) killEnemy(targets[i]);
            }
        }

        // Поява Боса (на 3-му етапі після 10 вбитих)
        if (stage.boss && gameState.killCount >= 10 && !gameState.bossActive) {
            spawnBoss(stage.boss);
        }

        // Перевірка перемоги (тільки якщо боса немає в планах на цей етап)
        if (gameState.score >= 40 && !gameState.bossActive && !stage.boss) winStage();
    };

    container.appendChild(enemy);

    let moveInt = setInterval(() => {
        if (!gameState.active || gameState.paused) return;
        if (!enemy.parentElement) return clearInterval(moveInt);

        pos += fromLeft ? DIFFICULTY_SETTINGS[gameState.difficulty].speed : -DIFFICULTY_SETTINGS[gameState.difficulty].speed;
        enemy.style.left = pos + 'px';

        if ((fromLeft && pos > window.innerWidth) || (!fromLeft && pos < -200)) {
            enemy.remove();
            takeDamage();
            clearInterval(moveInt);
        }
    }, 20);
}

function killEnemy(el) {
    const settings = DIFFICULTY_SETTINGS[gameState.difficulty];
    gameState.score += settings.points;
    gameState.killCount++;
    el.classList.add('dying');
    updateUI();
    setTimeout(() => el.remove(), 400);
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
        // Ефект безумства (Лавкрафт-стиль)
        boss.style.filter = "brightness(2) sepia(1) hue-rotate(90deg)";
        setTimeout(() => boss.style.filter = "drop-shadow(0 0 25px red)", 100);

        if (bossHp <= 0) {
            boss.remove();
            gameState.bossActive = false;
            winStage(); // Смерть боса = автоматична перемога
        }
    };
    container.appendChild(boss);
}

// --- 4. ЗДОРОВ'Я ТА HUD ---
function takeDamage() {
    if (gameState.invul || !gameState.active) return;
    gameState.hp--;
    updateUI();
    gameState.invul = true;
    
    document.getElementById('gameContainer').style.boxShadow = "inset 0 0 150px rgba(255, 0, 0, 0.7)";
    setTimeout(() => {
        gameState.invul = false;
        document.getElementById('gameContainer').style.boxShadow = "";
    }, 1000);

    if (gameState.hp <= 0) endGame(gameState.lang === 'uk' ? "Ваш розум не витримав. Агонія поглинула вас." : "Your mind shattered. Agony consumed you.");
}

function updateUI() {
    const T = TRANSLATIONS[gameState.lang];
    const stage = MAP_DATA[gameState.mapId].stages[gameState.stageIdx];
    
    document.getElementById('hud-map-name').textContent = stage.name;
    document.getElementById('scoreDisplay').textContent = `${T.score}: ${Math.floor(gameState.score)} / 40`;
    
    const maxHp = (gameState.difficulty === 'jaws') ? 5 : 10;
    let heartsHtml = '';
    for (let i = 0; i < maxHp; i++) {
        heartsHtml += (i < gameState.hp) ? '❤️' : '<span class="heart-lost">❤️</span>';
    }
    document.getElementById('heart-container').innerHTML = heartsHtml;

    // Кнопка Годинника
    const hasWatch = playerProgress.boughtItems && playerProgress.boughtItems.includes('watch');
    const existingWatch = document.getElementById('watch-btn-hud');
    
    if (hasWatch && !watchUsedInGame && !existingWatch) {
        const watchBtn = document.createElement('button');
        watchBtn.id = "watch-btn-hud";
        watchBtn.innerHTML = "⏳";
        watchBtn.className = "hud-item";
        watchBtn.onclick = useWatchBonus;
        document.getElementById('hud').appendChild(watchBtn);
    } else if (watchUsedInGame && existingWatch) {
        existingWatch.remove();
    }
}

// --- 5. ПЕРЕМОГА ТА ПРОГРЕС ---
function winStage() {
    gameState.active = false;
    clearInterval(gameTimer);
    clearInterval(spawnInterval);

    document.querySelectorAll('.target').forEach(t => t.remove());
    document.getElementById('pauseBtn').classList.add('hidden');

    const isBossLevel = gameState.stageIdx === 2;
    let rewardPearls = 15;
    let rewardSand = 0;

    if (isBossLevel) {
        rewardPearls = 60; // Нагорода за Жосткий Апгрейд
        rewardSand = 3;
        
        if (!playerProgress.completedMaps.includes(gameState.mapId)) {
            playerProgress.completedMaps.push(gameState.mapId);
        }

        const loots = ['tooth', 'tentacle', 'tongue', 'shell', 'god_verdict'];
        let lootKey = loots[gameState.mapId];
        if (lootKey) playerProgress.inventory.push(lootKey);

        if (!playerProgress.killedBosses.includes(gameState.mapId)) {
            playerProgress.killedBosses.push(gameState.mapId);
            if (playerProgress.killedBosses.length === 5) {
                playerProgress.achievements.push('SCP');
                if (typeof showSCPAchievement === 'function') showSCPAchievement();
            }
        }
    }

    playerProgress.pearls += rewardPearls;
    playerProgress.blackSand += rewardSand;
    saveGame();
    
    document.getElementById('hud').classList.add('hidden');
    document.getElementById('playerHealthDisplay').classList.add('hidden');
    
    showVictoryScreen(); 
}

function endGame(msg) {
    gameState.active = false;
    alert(msg);
    location.reload();
}

function togglePause() {
    if (!gameState.active) return;
    gameState.paused = !gameState.paused;
    if (gameState.paused) showPauseMenu();
    else document.getElementById('screen-renderer').classList.add('hidden');
}