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
        pearls: "Перлини", loot: "ВАШІ ТРОФЕЇ", goods: "ТОВАРИ", age: "Вік", 
        race: "Раса", activity: "Діяльність", bio: "Біографія",
        unlocked: "Розблоковано", locked: "Заблоковано"
    },
    en: { 
        title: "WATERY AGONY", maps: "MAPS", chars: "HEROES", shop: "SHOP", 
        bestiary: "BESTIARY", back: "BACK", score: "Score", time: "Time", 
        victory: "STAGE CLEAR", next: "DIVE DEEPER", finish: "SURFACE", 
        diff: "DIFFICULTY", easy: "EASY", normal: "NORM", jaws: "JAWS", 
        pearls: "Pearls", loot: "YOUR TROPHIES", goods: "GOODS", age: "Age", 
        race: "Race", activity: "Activity", bio: "Biography",
        unlocked: "Unlocked", locked: "Locked"
    }
};

// --- 2. КАРТИ ТА ЕТАПИ (5 регіонів) ---
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
    },
    { 
        id: 3, name: "Лихо у Тумані", 
        stages: [
            { id: 1, name: "Болото", bg: "assets/swamp_bg.png", enemies: ['snake.png', 'bat.png'], boss: null },
            { id: 2, name: "Довга Ріка", bg: "assets/long_river_bg.png", enemies: ['crocodile.png'], boss: null },
            { id: 3, name: "Мертва Лагуна", bg: "assets/dead_lagoon_bg.png", enemies: [], boss: "giant_turtle.png" }
        ]
    },
    { 
        id: 4, name: "Місто Спогадів", 
        stages: [
            { id: 1, name: "Місто Блервуд", bg: "assets/city_bg.png", enemies: ['wolf.png', 'bear.png'], boss: null },
            { id: 2, name: "Порт", bg: "assets/port_bg.png", enemies: ['fishman.png'], boss: null },
            { id: 3, name: "Лик Моря", bg: "assets/face_of_sea_bg.png", enemies: [], boss: "sea_serpent.png" }
        ]
    }
];

// --- 3. БЕСТІАРІЙ ---
const BESTIARY_CATEGORIES = {
    mobs: { uk: "ПРОСТІ МОБИ", en: "SIMPLE MOBS" },
    myth: { uk: "МІФОЛОГІЧНІ ІСТОТИ", en: "MYTHOLOGICAL CREATURES" },
    cryptids: { uk: "КРИПТИДИ", en: "CRYPTIDS" }
};

const BESTIARY_DATA = [
    // ПРОСТІ МОБИ (Mobs)
    { id: 'shark', category: 'mobs', name: "Акули", img: "assets/shark_1.png", desc: "Звичайні хижаки, що відчувають кров за милі." },
    { id: 'eel', category: 'mobs', name: "Мурена", img: "assets/moray_eel.png", desc: "Ховається в щілинах, атакує блискавично." },
    { id: 'octopus', category: 'mobs', name: "Восьминіг", img: "assets/octopus.png", desc: "Розумний мисливець з вісьмома щупальцями." },
    { id: 'ray', category: 'mobs', name: "Скат", img: "assets/stingray.png", desc: "Плаский вбивця, що маскується на дні." },
    { id: 'snake', category: 'mobs', name: "Болотяна змія", img: "assets/snake.png", desc: "Тихий вбивця, що ховається у рясці боліт." },
    { id: 'bat', category: 'mobs', name: "Кажани", img: "assets/bat.png", desc: "Зграї кровосісь, що атакують з туману." },
    { id: 'croc', category: 'mobs', name: "Крокодил", img: "assets/crocodile.png", desc: "Стародавній хижак річкових глибин Лиха у Тумані." },
    { id: 'wolf', category: 'mobs', name: "Лісовий вовк", img: "assets/wolf.png", desc: "Дикий звір, що охороняє підступи до Блервуда." },
    { id: 'bear', category: 'mobs', name: "Бурий ведмідь", img: "assets/bear.png", desc: "Величезна сила, що прокинулася в околицях Міста Спогадів." },
    { id: 'fishman', category: 'mobs', name: "Риболюди", img: "assets/fishman.png", desc: "Дивний підводний народ, що викрадає дітей у Блервуді." },

    // МІФОЛОГІЧНІ ІСТОТИ (Myth)
    { id: 'mermaid', category: 'myth', name: "Зла Русалка", img: "assets/evil_mermaid.png", desc: "Сирена, чий спів веде до загибелі на рифах." },
    { id: 'kraken', category: 'myth', name: "Кракен", img: "assets/kraken.png", desc: "Древній жах, здатний поглинути цілий флот." },
    { id: 'turtle', category: 'myth', name: "Гігантська черепаха", img: "assets/giant_turtle.png", desc: "Проклятий страж Лагуни, чий панцир міцніший за сталь." },
    { id: 'sea_serpent', category: 'myth', name: "Морський Змій", img: "assets/sea_serpent.png", desc: "Древній володар Лику Моря, чиє тіло обвиває Блервуд." },

    // КРИПТИДИ (Cryptids)
    { id: 'megalodon', category: 'cryptids', name: "Мегалодон", img: "assets/megalodon.png", desc: "Доісторичний хижак, що вважався вимерлим мільйони років." },
    { id: 'unknown', category: 'cryptids', name: "???", img: "assets/ui_bg.png", desc: "Безодня ще не відкрила всіх своїх таємниць..." }
];

// --- 4. СКЛАДНІСТЬ ---
const DIFFICULTY_SETTINGS = {
    easy:   { points: 3,   time: 60, speed: 3 },
    normal: { points: 1,   time: 50, speed: 5 },
    jaws:   { points: 0.5, time: 30, speed: 8 }
};

// --- 5. ЛЕГЕНДАРНІ ПРЕДМЕТИ ---
const LEGENDARY_ITEMS = {
    'tooth': { name: "Зуб Мегалодона", price: 10, img: "assets/megalodon_tooth.png" },
    'tentacle': { name: "Щупальце Кракена", price: 10, img: "assets/kraken_tentacle.png" },
    'tongue': { name: "Язик Сирени", price: 10, img: "assets/siren_tongue.png" },
    'shell': { name: "Шматок панцира", price: 10, img: "assets/turtle_shell.png" },
    'god_verdict': { name: "Божий Вирок", price: 50, img: "assets/god_verdict.png" }
};

// --- 6. КРАМНИЦЯ ---
const SHOP_ITEMS = [
    { id: 'machete', name: "Мачета", price: 100, desc: "Вбиває кількох ворогів за раз" },
    { id: 'scroll_about', name: "Свиток про...", price: 20, desc: "Таємні знання та легенди світу" }
];

// --- 7. ПРОГРЕС ---
let playerProgress = JSON.parse(localStorage.getItem('agony_save')) || {
    pearls: 0,
    inventory: [],
    shopUnlocked: false,
    completedMaps: [],
    boughtWeapons: ['none'],
    unlockedChars: [1]
};

let gameState = {
    lang: 'uk', active: false, paused: false, score: 0, hp: 10, 
    killCount: 0, mapId: 0, stageIdx: 0, difficulty: 'easy', 
    timeLeft: 60, bossActive: false, invul: false, weapon: 'none'
};

function saveGame() {
    localStorage.setItem('agony_save', JSON.stringify(playerProgress));
}

// --- 8. ЛЕГЕНДИ ТА ЛОР (ВИПРАВЛЕНО СТРУКТУРУ) ---
const LEGENDS_TEXT = {
    uk: {
        oceans_curse: {
            title: "ПРОКЛЯТТЯ СОЛОНОЇ КРОВІ",
            text: "Колись океани були чистими... Кажуть, кров першого вампіра Асіеля отруїла безодню. Вода стала солоною від сліз потопельників."
        },
        guardian_legend: {
            title: "ПРОКЛЯТИЙ СТРАЖ ЛАГУНИ",
            text: "Ця черепаха була священною, доки туман не отруїв її розум. Тепер вона стереже Мертву Лагуну."
        },
        god_abyss: {
            title: "БОГ БЕЗОДНІ",
            text: "Він спостерігає з глибини. Те, що ми вважали штормами — лише його дихання. Божий Вирок тепер у ваших руках."
        }
    },
    en: {
        oceans_curse: {
            title: "THE CURSE OF SALT BLOOD",
            text: "Once the oceans were pure... They say the blood of the first vampire, Asiel, poisoned the abyss."
        },
        guardian_legend: {
            title: "CURSED GUARDIAN OF THE LAGOON",
            text: "This turtle was sacred until the mist poisoned its mind. Now it guards the Dead Lagoon."
        },
        god_abyss: {
            title: "GOD OF THE ABYSS",
            text: "He watches from the depths. What we thought were storms is only his breath."
        }
    }
};

// --- 9. ГЕРОЇ ---
const CHARACTER_DATA = [
    { 
        id: 1, 
        name: { uk: "Стенлі Акуловбивця", en: "Stanley Sharkslayer" }, 
        img: "assets/stanley.png", unlocked: true,
        stats: {
            age: { uk: "42 роки", en: "42 years" },
            race: { uk: "Людина", en: "Human" },
            activity: { uk: "Капітан / Мисливець", en: "Captain / Hunter" },
            bio: { uk: "Втратив сім'ю під час атаки акули. Присвятив життя помсті.", en: "Lost family to a shark attack. Dedicated life to revenge." }
        }
    },
    { 
        id: 2, 
        name: { uk: "Русалка (Міра)", en: "Mermaid (Mira)" }, 
        img: "assets/mermaid.png", unlocked: false,
        stats: {
            age: { uk: "Невідомо", en: "Unknown" },
            race: { uk: "Сирена безодні", en: "Abyss Siren" },
            activity: { uk: "Торговець", en: "Merchant" },
            bio: { uk: "Прокляття Асіеля перетворило її на сирену.", en: "Asiel's curse turned her into a siren." }
        }
    }
];