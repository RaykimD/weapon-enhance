export const ENHANCEMENT_RATES = {
    0: { success: 95, destroy: 0, degrade: 2.5 },
    1: { success: 85, destroy: 0, degrade: 7.5 },
    2: { success: 75, destroy: 0, degrade: 12.5 },
    3: { success: 65, destroy: 0, degrade: 17.5 },
    4: { success: 55, destroy: 0, degrade: 22.5 },
    5: { success: 45, destroy: 38.5, degrade: 16.5 },
    6: { success: 35, destroy: 45.5, degrade: 19.5 },
    7: { success: 25, destroy: 52.5, degrade: 22.5 },
    8: { success: 15, destroy: 59.5, degrade: 25.5 },
    9: { success: 10, destroy: 63, degrade: 27 },
    10: { success: 5, destroy: 66.5, degrade: 28.5 },
    11: { success: 5, destroy: 66.5, degrade: 28.5 }
} as const;

export const STONE_TYPES = {
    normal: {
        name: '강화석',
        cost: 5000,
        successBonus: 0,
        materials: {
            iron: 3,
            blackIron: 1,
            specialIron: 1,
            lapis: 5
        }
    },
    advanced: {
        name: '상급 강화석',
        cost: 10000,
        successBonus: 5,
        materials: {
            iron: 3,
            blackIron: 1,
            specialIron: 1,
            lapis: 5
        }
    },
    supreme: {
        name: '고급 강화석',
        cost: 20000,
        successBonus: 10,
        materials: {
            iron: 3,
            blackIron: 1,
            specialIron: 1,
            lapis: 5
        }
    }
} as const;

export const WEAPON_NAMES: Record<string, string> = {
    bow: '활',
    sword: '검',
    spear: '창',
    dagger: '단검',
    fan: '부채'
};