export type Weapon = {
    id: string;
    type: string;
    enhancement: number;
    createdAt: number;
};

export type EnhanceLog = {
    type: 'success' | 'degrade' | 'maintain' | 'destroy';
    weaponType: string;
    enhancement: number;
    timestamp: number;
};

export type UsedResources = {
    stones: {
        normal: number;
        advanced: number;
        supreme: number;
    };
    materials: {
        iron: number;
        blackIron: number;
        specialIron: number;
        lapis: number;
    };
    money: number;
};

export type Stats = {
    totalAttempts: number;
    successes: number;
    failures: number;
    destroys: number;
    maxEnhance: number;
};