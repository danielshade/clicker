/**
 * DATA.JS - Глобальні дані, налаштування та прогрес гри "Водяна Агонія"
 */

// --- 1. ПЕРЕКЛАДИ ---
const TRANSLATIONS = {
    uk: { 
        title: "ВОДЯНА АГОНІЯ", maps: "МАПИ", chars: "ГЕРОЇ", shop: "КРАМНИЦЯ", 
        bestiary: "БЕСТІАРІЙ", back: "НАЗАД", score: "Очки", time: "Час", 
        victory: "ЕТАП ПРОЙДЕНО", next: "ЗАНУРИТИСЬ", finish: "НА ПОВЕРХНЮ", 
        diff: "СКЛАДНІСТЬ", easy: "ЛЕГКО", normal: "НОРМ", jaws: "JAWS", 
        pearls: "Перлини", loot: "ВАШІ ТРОФЕЇ", goods: "ТОВАРИ"
    },
    en: { 
        title: "WATERY AGONY", maps: "MAPS", chars: "HEROES", shop: "SHOP", 
        bestiary: "BESTIARY", back: "BACK", score: "Score", time: "Time", 
        victory: "STAGE CLEAR", next: "DIVE DEEPER", finish: "SURFACE", 
        diff: "DIFFICULTY", easy: "EASY", normal: "NORM", jaws: "JAWS", 
        pearls: "Pearls", loot: "YOUR TROPHIES", goods: "GOODS"
    }
};

// --- 2. КАРТИ ТА ЕТАПИ (3 регіони по 3 рівні) ---
const MAP_DATA = [
    { 
        id: 0, name: "Узбережжя Короля", 
        stages: [
            { id: 1, name: "Затока надії", bg: "assets/background.png", enemies: ['shark_1.png', 'shark_2.png'], boss: null },
            { id: 2, name: "Скелі відчаю", bg: "assets/background.png", enemies: ['shark_2.png', 'shark_3.png'], boss: null },
            { id: 3, name: "Глибина Мегалодона", bg: "assets/background.png", enemies: ['shark_1.png'], boss: "megalodon.png" }
        ]
    },
    { 
        id: 1, name: "Окови Безодні", 
        stages: [
            { id: 1, name: "Темний вхід", bg: "assets/abyss_bg.png", enemies: ['moray_eel.png'], boss: null },
            { id: 2, name: "Забуті тіні", bg: "assets/abyss_bg.png", enemies: ['octopus.png', 'squid.png'], boss: null },
            { id: 3, name: "Логово Кракена", bg: "assets/kraken_bg.png", enemies: [], boss: "kraken.png" }
        ]
    },
    { 
        id: 2, name: "Моторошні Корали", 
        stages: [
            { id: 1, name: "Рожевий туман", bg: "assets/corals_abyss_bg.png", enemies: ['stingray.png', 'barracuda.png'], boss: null },
            { id: 2, name: "Гострі рифи", bg: "assets/corals_acceptance_bg.png", enemies: ['white_shark.png'], boss: null },
            { id: 3, name: "Гніздо Русалки", bg: "assets/corals_despair_bg.png", enemies: [], boss: "evil_mermaid.png" }
        ]
    }
];

// --- 3. БЕСТІАРІЙ ---
const BESTIARY_DATA = [
    { name: "Мегалодон", img: "assets/megalodon.png", desc: "Доісторична акула неймовірних розмірів." },
    { name: "Кракен", img: "assets/kraken.png", desc: "Легендарний кальмар, що трощить кораблі." },
    { name: "Мурена", img: "assets/moray_eel.png", desc: "Хижий вугор безодні. Дуже швидкий." },
    { name: "Зла Русалка", img: "assets/evil_mermaid.png", desc: "Її спів заманює моряків на гострі рифи." }
];

// --- 4. СКЛАДНІСТЬ ---
const DIFFICULTY_SETTINGS = {
    easy:   { points: 3,   time: 60, speed: 3 },
    normal: { points: 1,   time: 50, speed: 5 },
    jaws:   { points: 0.5, time: 30, speed: 8 }
};

// --- 5. ЛЕГЕНДАРНІ ПРЕДМЕТИ (Трофеї з босів) ---
const LEGENDARY_ITEMS = {
    'tooth':    { name: "Зуб Мегалодона", price: 10, img: "assets/megalodon_tooth.png" },
    'tentacle': { name: "Щупальце Кракена", price: 10, img: "assets/kraken_tentacle.png" },
    'tongue':   { name: "Язик Сирени", price: 10, img: "assets/siren_tongue.png" }
};

// --- 6. ТОВАРИ У КРАМНИЦІ ---
const SHOP_ITEMS = [
    { id: 'scroll_about', name: "Свиток про...", price: 20, desc: "Відкриває таємні знання (вибір всередині)" },
    { id: 'cool_weapon', name: "Майбутня зброя", price: 999, desc: "Незабаром у продажу..." }
];

// --- 7. ПРОГРЕС ТА СТАН ГРИ ---
let playerProgress = JSON.parse(localStorage.getItem('agony_save')) || {
    pearls: 0,
    inventory: [],          // Список ключів легендарних предметів (напр. ['tooth'])
    shopUnlocked: false,    // Відкривається після Кракена на Normal
    unlockedChars: [1]      // ID доступних персонажів
};

let gameState = {
    lang: 'uk', 
    active: false, 
    paused: false, 
    score: 0, 
    hp: 10, 
    killCount: 0, 
    mapId: 0, 
    stageIdx: 0, 
    difficulty: 'easy', 
    timeLeft: 60, 
    bossActive: false, 
    invul: false
};

// Функція збереження
function saveGame() {
    localStorage.setItem('agony_save', JSON.stringify(playerProgress));
}