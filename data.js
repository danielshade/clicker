/**
 * DATA.JS - Глобальні дані та прогрес гри "Водяна Агонія"
 * Оновлення 6.5: Жосткий Апгрейд (Лавкрафт, Нові Герої та Атлас Світу)
 */

// --- 1. ПЕРЕКЛАДИ ---
const TRANSLATIONS = {
    uk: { 
        title: "ВОДЯНА АГОНІЯ", maps: "МАПИ", world: "СВІТ", chars: "ГЕРОЇ", shop: "КРАМНИЦЯ", 
        bestiary: "БЕСТІАРІЙ", back: "НАЗАД", score: "Очки", time: "Час", 
        victory: "ЕТАП ПРОЙДЕНО", next: "ЗАНУРИТИСЬ", finish: "НА ПОВЕРХНЮ", 
        diff: "СКЛАДНІСТЬ", easy: "ЛЕГКО", normal: "НОРМ", jaws: "JAWS", 
        pearls: "Перлини", loot: "ВАШІ ТРОФЕЇ", goods: "ТОВАРИ", age: "Вік", 
        race: "Раса", activity: "Діяльність", bio: "Біографія",
        unlocked: "Розблоковано", locked: "ЗАБЛОКОВАНО", locked_region: "НЕВІДОМА ЗЕМЛЯ",
        invitation: "ЗАПРОШЕННЯ", invited_chars: "ЗАПРОШЕНІ ГЕРОЇ", 
        roll: "ПОКРУТИТИ", buy: "КУПИТИ", black_sand: "Чорний Пісок", 
        pause: "ПАУЗА", resume: "ПРОДОВЖИТИ", main_menu: "ГОЛОВНЕ МЕНЮ"
    },
    en: { 
        title: "WATERY AGONY", maps: "MAPS", world: "WORLD", chars: "HEROES", shop: "SHOP", 
        bestiary: "BESTIARY", back: "BACK", score: "Score", time: "Time", 
        victory: "STAGE CLEAR", next: "DIVE DEEPER", finish: "SURFACE", 
        diff: "DIFFICULTY", easy: "EASY", normal: "NORM", jaws: "JAWS", 
        pearls: "Pearls", loot: "YOUR TROPHIES", goods: "GOODS", age: "Age", 
        race: "Race", activity: "Activity", bio: "Biography",
        unlocked: "Unlocked", locked: "LOCKED", locked_region: "UNKNOWN LAND",
        invitation: "INVITATION", invited_chars: "INVITED HEROES", 
        roll: "ROLL", buy: "BUY", black_sand: "Black Sand", 
        pause: "PAUSE", resume: "RESUME", main_menu: "MAIN MENU"
    }
};

// --- 2. КАРТИ ТА ЕТАПИ (Відкриті регіони) ---
const MAP_DATA = [
    { id: 0, name: "Узбережжя Короля", stages: [
        { id: 1, name: "Затока надії", bg: "assets/background.png", enemies: ['shark_1.png', 'shark_2.png'], boss: null },
        { id: 2, name: "Скелі відчаю", bg: "assets/background.png", enemies: ['shark_2.png', 'shark_3.png'], boss: null },
        { id: 3, name: "Глибина Мегалодона", bg: "assets/background.png", enemies: ['shark_1.png'], boss: "megalodon.png" }
    ]},
    { id: 1, name: "Окови Безодні", stages: [
        { id: 1, name: "Темний вхід", bg: "assets/abyss_bg.png", enemies: ['moray_eel.png'], boss: null },
        { id: 2, name: "Забуті тіні", bg: "assets/abyss_bg.png", enemies: ['octopus.png', 'squid.png'], boss: null },
        { id: 3, name: "Логово Кракена", bg: "assets/kraken_bg.png", enemies: [], boss: "kraken.png" }
    ]},
    { id: 2, name: "Моторошні Корали", stages: [
        { id: 1, name: "Рожевий туман", bg: "assets/corals_abyss_bg.png", enemies: ['stingray.png', 'barracuda.png'], boss: null },
        { id: 2, name: "Гострі рифи", bg: "assets/corals_acceptance_bg.png", enemies: ['white_shark.png'], boss: null },
        { id: 3, name: "Гніздо Русалки", bg: "assets/corals_despair_bg.png", enemies: [], boss: "evil_mermaid.png" }
    ]},
    { id: 3, name: "Лихо у Тумані", stages: [
        { id: 1, name: "Болото", bg: "assets/swamp_bg.png", enemies: ['snake.png', 'bat.png'], boss: null },
        { id: 2, name: "Довга Ріка", bg: "assets/long_river_bg.png", enemies: ['crocodile.png'], boss: null },
        { id: 3, name: "Мертва Лагуна", bg: "assets/dead_lagoon_bg.png", enemies: [], boss: "giant_turtle.png" }
    ]},
    { id: 4, name: "Місто Спогадів", stages: [
        { id: 1, name: "Місто Блервуд", bg: "assets/city_bg.png", enemies: ['wolf.png', 'bear.png'], boss: null },
        { id: 2, name: "Порт", bg: "assets/port_bg.png", enemies: ['fishman.png'], boss: null },
        { id: 3, name: "Лик Моря", bg: "assets/face_of_sea_bg.png", enemies: [], boss: "sea_serpent.png" }
    ]}
];

// --- 2.1 ЗАБЛОКОВАНІ РЕГІОНИ (Для Атласу Світу) ---
const WORLD_REGIONS = [
    { id: 101, name: "Земля Циклопа", locked: true },
    { id: 102, name: "Вий", locked: true },
    { id: 103, name: "Озеро Мерців", locked: true },
    { id: 104, name: "Океан Тисячі Кошмарів", locked: true }
];

// --- 3. БЕСТІАРІЙ ---
const BESTIARY_DATA = [
    { id: 'shark', category: 'mobs', name: "Глибинна Акула", img: "assets/shark_1.png", desc: "Її очі не бачать світла, лише тепло твоєї пульсуючої крові." },
    { id: 'eel', category: 'mobs', name: "Мурена-Тінь", img: "assets/moray_eel.png", desc: "Виповзає зі щілин, які ведуть прямо в серце безодні." },
    { id: 'octopus', category: 'mobs', name: "Багаторук", img: "assets/octopus.png", desc: "Його мозок такий же великий, як і його ненависть до тих, хто дихає повітрям." },
    { id: 'squid', category: 'mobs', name: "Стискач", img: "assets/squid.png", desc: "Десять щупалець, щоб обійняти тебе... і розчавити твої легені." },
    { id: 'ray', category: 'mobs', name: "Скат-Привид", img: "assets/stingray.png", desc: "Плаский вбивця, що ковзає по дну, як сама смерть." },
    { id: 'barracuda', category: 'mobs', name: "Срібна Стріла", img: "assets/barracuda.png", desc: "Ти не побачиш її нападу, лише спалах металу в темній воді." },
    
    { id: 'snake', category: 'mobs', name: "Гнильна Змія", img: "assets/snake.png", desc: "Мешкає в болотах, де сама вода смердить гріхами минулого." },
    { id: 'bat', category: 'mobs', name: "Крилан Туману", img: "assets/bat.png", desc: "Вони не кусають, вони випивають твої спогади, поки ти спиш." },
    { id: 'croc', category: 'mobs', name: "Древній Алігатор", img: "assets/crocodile.png", desc: "Він пам'ятає перших людей. І він пам'ятає смак їхньої плоті." },
    
    { id: 'wolf', category: 'mobs', name: "Вовк Блервуда", img: "assets/wolf.png", desc: "В його витті чутно голоси всіх, хто загубився в навколишніх лісах." },
    { id: 'bear', category: 'mobs', name: "Одержимий Ведмідь", img: "assets/bear.png", desc: "Величезна гора м'язів та гніву, керована чимось ззовні." },
    { id: 'fishman', category: 'mobs', name: "Глибоководний", img: "assets/fishman.png", desc: "Напівлюдина-напівриба. Вони приходять з порту Блервуда за даниною." },
    
    { id: 'mermaid', category: 'myth', name: "Зла Русалка", img: "assets/evil_mermaid.png", desc: "Її краса — лише маска для обличчя, що складається з тисячі іклів." },
    { id: 'kraken', category: 'myth', name: "Кракен", img: "assets/kraken.png", desc: "Його сни стають штормами. Його гнів стає кінцем світу." },
    { id: 'turtle', category: 'myth', name: "Страж Лагуни", img: "assets/giant_turtle.png", desc: "На її панцирі викарбувані руни, які не можна читати вголос." },
    { id: 'sea_serpent', category: 'myth', name: "Лик Моря", img: "assets/sea_serpent.png", desc: "Він — це і є океан. Нескінченний, холодний і безжальний." },
    
    { id: 'megalodon', category: 'cryptids', name: "Мегалодон", img: "assets/megalodon.png", desc: "Жива викопна істота, що вирвалася з полону льодовиків." },
    { id: 'white_shark', category: 'cryptids', name: "Біла Смерть", img: "assets/white_shark.png", desc: "Король хижаків, що не знає страху, лише вічний голод." }
];

const BESTIARY_CATEGORIES = {
    mobs: { uk: "ПРОСТІ МОБИ", en: "SIMPLE MOBS" },
    myth: { uk: "МІФОЛОГІЧНІ ІСТОТИ", en: "MYTHOLOGICAL CREATURES" },
    cryptids: { uk: "КРИПТИДИ", en: "CRYPTIDS" }
};

// --- 4. СКЛАДНІСТЬ ---
const DIFFICULTY_SETTINGS = {
    easy:   { points: 3,   time: 80, speed: 3 },
    normal: { points: 1,   time: 80, speed: 5 },
    jaws:   { points: 0.5, time: 80, speed: 8 }
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
    { id: 'watch', name: "Старий Годинник", price: 120, desc: "+20 секунд (використати 1 раз за раунд)" },
    { id: 'scroll_about', name: "Свиток про...", price: 20, desc: "Таємні знання та легенди світу" }
];

// --- 7. ПРОГРЕС ТА СТАН ---
let playerProgress = JSON.parse(localStorage.getItem('agony_save')) || {
    pearls: 0,
    blackSand: 0,
    unlockedChars: [1],
    completedMaps: [],
    seenStory: [],
    killedBosses: [],
    achievements: [],
    boughtWeapons: ['none'],
    boughtItems: [],
    shopUnlocked: false,
    inventory: []
};

let gameState = {
    lang: 'uk', active: false, paused: false, score: 0, hp: 10, 
    killCount: 0, mapId: 0, stageIdx: 0, difficulty: 'easy', 
    timeLeft: 80, bossActive: false, invul: false, weapon: 'none'
};

function saveGame() {
    localStorage.setItem('agony_save', JSON.stringify(playerProgress));
}

// --- 8. ЛЕГЕНДИ ТА ЛОР ---
const LEGENDS_TEXT = {
    uk: {
        megalodon: { title: "ТІНЬ МИНУЛОГО: МЕГАЛОДОН", text: "Мегалодон — це не просто акула, це кара Океану за жадібність людей..." },
        mermaid: { title: "СПІВ СИРЕНИ", text: "Її голос став отруйним після того, як вона випила воду з проклятого джерела Асіеля..." },
        stanley: { title: "ЩОДЕННИК СТЕНЛІ", text: "«Мій брат не просто зник. Його забрав Лик Моря...»" },
        guardian: { title: "ЗАБУТИЙ СТРАЖ", text: "Туман просочився під її панцир, перетворивши захисника на безумного ката..." },
        blairwood: { title: "ТАЄМНИЦЯ БЛЕРВУДА", text: "Місто було збудоване на кістках морських велетнів..." },
        asiel_origin: { title: "КРОВ АСІЕЛЯ", text: "Його сльози створили Чорний Пісок. Поки він сиплеться, прокляття триває..." }
    },
    en: {
        megalodon: { title: "SHADOW OF THE PAST: MEGALODON", text: "Megalodon is more than a shark, it's the Ocean's wrath..." },
        mermaid: { title: "SIREN'S SONG", text: "Her voice became poison after drinking from Asiel's source..." },
        stanley: { title: "STANLEY'S JOURNAL", text: "«My brother didn't just disappear. The Face of the Sea took him...»" },
        guardian: { title: "FORGOTTEN GUARDIAN", text: "The Mist seeped under her shell, turning the protector mad..." },
        blairwood: { title: "MYSTERY OF BLAIRWOOD", text: "The city was built on the bones of sea giants..." },
        asiel_origin: { title: "BLOOD OF ASIEL", text: "His tears created Black Sand. As long as it pours, the curse remains..." }
    }
};

// --- 9. ГЕРОЇ (Лавкрафтіанські образи) ---
const CHARACTER_DATA = [
    { id: 1, name: { uk: "Стенлі Акуловбивця", en: "Stanley Sharkslayer" }, img: "assets/stanley.png", stats: { age: "42", race: "Людина", activity: "Капітан", bio: "Його розум тріщить під тиском безодні, але жага помсти веде його крізь шторми." } },
    { id: 2, name: { uk: "Русалка (Міра)", en: "Mermaid (Mira)" }, img: "assets/mermaid.png", stats: { age: "???", race: "Сирена", activity: "Торговець", bio: "Вона бачила народження зірок з океанського мулу. Її очі — це чорні озерця безумства." } },
    { id: 3, name: { uk: "Елра (Старійшина)", en: "Elra (Elder)" }, img: "assets/elder_woman.png", stats: { age: "80", race: "Людина", activity: "Старійшина", bio: "Пам'ятає часи, коли море було сушею, а старі боги ходили серед рибалок." } },
    { id: 4, name: { uk: "Мер Блервуда", en: "Mayor of Blairwood" }, img: "assets/mayor.png", stats: { age: "55", race: "Людина", activity: "Мер міста", bio: "Він підписав договір кров'ю, щоб врятувати Блервуд. Але борг лише зростає." } },
    { id: 5, name: { uk: "Нейрак", en: "Neyrak" }, img: "assets/neyrak.png", stats: { age: "19", race: "Людина(?)", activity: "Помічник капітана", bio: "Має сиве волосся і чує шепіт з-під палуби. Кажуть, він бачить те, що не бачать інші." } },
    { id: 6, name: { uk: "Беовульф", en: "Beowulf" }, img: "assets/beowulf.png", stats: { age: "40", race: "Вовкулака", activity: "Звір Блервуда", bio: "Прокляття місяця змішалося з отрутою безодні. Він — звір у людській подобі." } },
    { id: 7, name: { uk: "Тіамат", en: "Tiamat" }, img: "assets/tiamat.png", stats: { age: "Антична", race: "Відьма", activity: "Хазяйка акул", bio: "Стародавня сутність, чий сміх викликає цунамі. Вона веде акул у бій." } },
    { id: 8, name: { uk: "Мисливець Едуард", en: "Hunter Eduard" }, img: "assets/eduard.png", stats: { age: "35", race: "Людина", activity: "Мисливець на тіні", bio: "Житель Блервуда. Його тіло вкрите рунами, що відлякують сутностей з туману." } },
    { id: 9, name: { uk: "Сестра Гвендолін", en: "Sister Gwendolyn" }, img: "assets/gwendolyn.png", stats: { age: "28", race: "Людина", activity: "Монахиня", bio: "Служителька Храму Стража. Вона молиться за душі тих, хто не повернувся з води." } }
];