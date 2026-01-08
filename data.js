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
        pearls: "Перлини", loot: "ВАШІ ТРОФЕЇ", goods: "ТОВАРИ", age: "Вік", race: "Раса", activity: "Діяльність", bio: "Біографія",
        unlocked: "Розблоковано", locked: "Заблоковано"
    },
    en: { 
        title: "WATERY AGONY", maps: "MAPS", chars: "HEROES", shop: "SHOP", 
        bestiary: "BESTIARY", back: "BACK", score: "Score", time: "Time", 
        victory: "STAGE CLEAR", next: "DIVE DEEPER", finish: "SURFACE", 
        diff: "DIFFICULTY", easy: "EASY", normal: "NORM", jaws: "JAWS", 
        pearls: "Pearls", loot: "YOUR TROPHIES", goods: "GOODS", age: "Age", race: "Race", activity: "Activity", bio: "Biography",
        unlocked: "Unlocked", locked: "Locked"

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

// --- КАТЕГОРІЇ БЕСТІАРІЮ ---
const BESTIARY_CATEGORIES = {
    mobs: { uk: "ПРОСТІ МОБИ", en: "SIMPLE MOBS" },
    myth: { uk: "МІФОЛОГІЧНІ ІСТОТИ", en: "MYTHOLOGICAL CREATURES" },
    cryptids: { uk: "КРИПТИДИ", en: "CRYPTIDS" }
};

const BESTIARY_DATA = [
    // ПРОСТІ МОБИ
    { id: 'shark', category: 'mobs', name: "Акули", img: "assets/shark_1.png", desc: "Звичайні хижаки, що відчувають кров за милі." },
    { id: 'eel', category: 'mobs', name: "Мурена", img: "assets/moray_eel.png", desc: "Ховається в щілинах, атакує блискавично." },
    { id: 'octopus', category: 'mobs', name: "Восьминіг", img: "assets/octopus.png", desc: "Розумний мисливець з вісьмома щупальцями." },
    { id: 'ray', category: 'mobs', name: "Скат", img: "assets/stingray.png", desc: "Плаский вбивця, що маскується на дні." },

    // МІФОЛОГІЧНІ ІСТОТИ
    { id: 'mermaid', category: 'myth', name: "Зла Русалка", img: "assets/evil_mermaid.png", desc: "Сирена, чий спів веде до загибелі на рифах." },
    { id: 'kraken', category: 'myth', name: "Кракен", img: "assets/kraken.png", desc: "Древній жах, здатний поглинути цілий флот." },

    // КРИПТИДИ
    { id: 'megalodon', category: 'cryptids', name: "Мегалодон", img: "assets/megalodon.png", desc: "Доісторичний хижак, що вважався вимерлим мільйони років." },
    { id: 'unknown', category: 'cryptids', name: "???", img: "assets/ui_bg.png", desc: "У цих водах бачили щось набагато більше за Мегалодона. Попереду нові зустрічі..." }
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

// --- ЛЕГЕНДИ ТА ЛОР ---
const LEGENDS_TEXT = {
    uk: {
        oceans_curse: {
            title: "ПРОКЛЯТТЯ СОЛОНОЇ КРОВІ",
            text: `Колись океани були колискою життя, солодкими та чистими. Але в епоху Чорного Сонця, коли стародавні боги відвернулися від світу, відбувся Катаклізм. 
            
            Кажуть, що кров першого вампіра Асіеля потрапила в безодню, отруївши кожну краплю. Вода стала солоною від сліз потопельників і гіркою від прокляття безсмертя. 
            
            Відтоді океан — це не просто вода, а жива тюрма. Кожна акула, кожен вугор — це лише інструмент агонії, що карає тих, хто насмілився порушити спокій проклятих глибин. Безодня не просто топить, вона п'є твою душу.`
        }
    },
    en: {
        oceans_curse: {
            title: "THE CURSE OF SALT BLOOD",
            text: `Once, the oceans were the cradle of life, sweet and clear. But during the era of the Black Sun, when the ancient gods turned away, the Cataclysm occurred. 
            
            They say the blood of the first vampire, Asiel, fell into the abyss, poisoning every drop. The water became salty from the tears of the drowned and bitter from the curse of immortality. 
            
            Since then, the ocean is not just water, but a living prison. Every shark, every eel is merely an instrument of agony, punishing those who dare to disturb the peace of the cursed depths.`
        }
    }
};

const CHARACTER_DATA = [
    { 
        id: 1, 
        name: { uk: "Стенлі Акуловбивця", en: "Stanley Sharkslayer" }, 
        img: "assets/stanley.png", 
        unlocked: true,
        stats: {
            age: { uk: "42 роки", en: "42 years" },
            race: { uk: "Людина", en: "Human" },
            activity: { uk: "Капітан / Мисливець", en: "Captain / Hunter" },
            bio: { 
                uk: "Втратив свою сім'ю під час атаки великої білої акули. Тепер він присвятив життя очищенню проклятих океанів від морських чудовиськ.",
                en: "Lost his family during a Great White attack. Now he dedicated his life to purging the cursed oceans of sea monsters."
            }
        }
    },
    { 
        id: 2, 
        name: { uk: "Русалка (Міра)", en: "Mermaid (Mira)" }, 
        img: "assets/mermaid.png", 
        unlocked: false, // Відкривається після купівлі в крамниці
        stats: {
            age: { uk: "Невідомо (безсмертна)", en: "Unknown (immortal)" },
            race: { uk: "Сирена безодні", en: "Abyss Siren" },
            activity: { uk: "Хранителька секретів / Торговець", en: "Keeper of Secrets / Merchant" },
            bio: { 
                uk: "Колись була звичайною дівчиною, але прокляття Асіеля перетворило її на сирену. Вона допомагає Стенлі за перлини, сподіваючись викупити свою свободу.",
                en: "Once a normal girl, but Asiel's curse turned her into a siren. She helps Stanley for pearls, hoping to buy her freedom."
            }
        }
    }
];