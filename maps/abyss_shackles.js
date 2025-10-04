const ABYSS_SHACKLES_DATA = {
    name_uk: "Окови Безодні",
    name_en: "Abyss Shackles",
    background: 'bg-abyss',
    levels: [
        { name_uk: "Глибина 1", name_en: "Depth 1", enemies: ['octopus'] },
        { name_uk: "Глибина 2", name_en: "Depth 2", enemies: ['octopus', 'barracuda'] },
        { name_uk: "Глибина 3", name_en: "Depth 3", enemies: ['barracuda'] },
        { name_uk: "Глибина 4", name_en: "Depth 4", enemies: ['barracuda', 'octopus'], miniboss: 'squid' },
        { name_uk: "КРАКЕН", name_en: "KRAKEN", finalBoss: 'kraken', background: 'bg-kraken' }
    ]
};