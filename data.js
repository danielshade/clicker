/**
 * DATA.JS - Перевірено за скріншотом assets
 */

const TRANSLATIONS = {
    uk: { title: "ВОДЯНА АГОНІЯ", maps: "МАПИ", chars: "ГЕРОЇ", shop: "КРАМНИЦЯ", bestiary: "БЕСТІАРІЙ", back: "НАЗАД", score: "Очки", time: "Час", victory: "ЕТАП ПРОЙДЕНО", next: "ЗАНУРИТИСЬ", finish: "НА ПОВЕРХНЮ", diff: "СКЛАДНІСТЬ", easy: "ЛЕГКО", normal: "НОРМ", jaws: "ЩЕЛЕПИ", pearls: "Перлини" },
    en: { title: "WATERY AGONY", maps: "MAPS", chars: "HEROES", shop: "SHOP", bestiary: "BESTIARY", back: "BACK", score: "Score", time: "Time", victory: "STAGE CLEAR", next: "DIVE DEEPER", finish: "SURFACE", diff: "DIFFICULTY", easy: "EASY", normal: "NORM", jaws: "JAWS", pearls: "Pearls" }
};

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

const BESTIARY_DATA = [
    { name: "Мегалодон", img: "assets/megalodon.png", desc: "Доісторична акула." },
    { name: "Кракен", img: "assets/kraken.png", desc: "Гігантський кальмар." },
    { name: "Мурена", img: "assets/moray_eel.png", desc: "Хижий вугор безодні." }
];

const SHOP_DATA = [
    { id: 'hp', name: "Додаткове ХП", price: 50, desc: "+2 ❤️" }
];

const DIFFICULTY_SETTINGS = {
    easy: { points: 3, time: 60, speed: 3 },
    normal: { points: 1, time: 50, speed: 5 },
    jaws: { points: 0.5, time: 30, speed: 8 }
};


// Стан гри
let playerProgress = JSON.parse(localStorage.getItem('agony_save')) || { pearls: 0, unlocked: [1] };
let gameState = {
    lang: 'uk', active: false, paused: false,
    score: 0, hp: 10, killCount: 0,
    mapId: 0, stageIdx: 0, difficulty: 'easy',
    timeLeft: 60, bossActive: false, invul: false
};