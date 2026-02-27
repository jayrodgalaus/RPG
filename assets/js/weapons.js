const weaponTypes = [
   /* 0 */{ type: "Sword", slot:1, atk_chance: 0.30, spd_chance: 0.30, def_chance: 0.20, hp_chance: 0.20 },
   /* 1 */{ type: "Axe", slot:1, atk_chance: 0.40, spd_chance: 0.20, def_chance: 0.25, hp_chance: 0.15 },
   /* 2 */{ type: "Hammer", slot:1, atk_chance: 0.35, spd_chance: 0.10, def_chance: 0.30, hp_chance: 0.25 },
   /* 3 */{ type: "Scythe", slot:1, atk_chance: 0.25, spd_chance: 0.35, def_chance: 0.15, hp_chance: 0.25 },
   /* 4 */{ type: "Twin Swords", slot:1, atk_chance: 0.20, spd_chance: 0.45, def_chance: 0.15, hp_chance: 0.20 },
   /* 5 */{ type: "Greatsword", slot:1, atk_chance: 0.50, spd_chance: 0.10, def_chance: 0.25, hp_chance: 0.15 },
   /* 6 */{ type: "Dagger", slot:1, atk_chance: 0.15, spd_chance: 0.55, def_chance: 0.10, hp_chance: 0.20 },
   /* 7 */{ type: "Spear", slot:1, atk_chance: 0.35, spd_chance: 0.35, def_chance: 0.20, hp_chance: 0.10 }
];
const weaponList = [
    /* 0 */{category:"weapon", name: "Sword", type: weaponTypes[0], mob: "Beginner", img: eqp_path + "Beginner/1.webp" },
    /* 1 */{category:"weapon", name: "Axe", type: weaponTypes[1], mob: "Beginner", img: eqp_path + "Beginner/1.webp" },
    /* 2 */{category:"weapon", name: "Hammer", type: weaponTypes[2], mob: "Beginner", img: eqp_path + "Beginner/1.webp" },
    /* 3 */{category:"weapon", name: "Scythe", type: weaponTypes[3], mob: "Beginner", img: eqp_path + "Beginner/1.webp" },
    /* 4 */{category:"weapon", name: "Twin Swords", type: weaponTypes[4], mob: "Beginner", img: eqp_path + "Beginner/1.webp" },
    /* 5 */{category:"weapon", name: "Greatsword", type: weaponTypes[5], mob: "Beginner", img: eqp_path + "Beginner/1.webp" },
    /* 6 */{category:"weapon", name: "Dagger", type: weaponTypes[6], mob: "Beginner", img: eqp_path + "Beginner/1.webp" },
    /* 7 */{category:"weapon", name: "Shield", type: weaponTypes[7], mob: "Beginner", img: eqp_path + "Beginner/1.webp" },
    /* 8 */{category:"weapon", name: "Spear",	type: weaponTypes[8], mob: "Beginner", img: eqp_path + "Beginner/1.webp" },
    //Fallen
    /* 9 */{category:"weapon", name: "Twin Swords", type: weaponTypes[4], mob: "Fallen", img: eqp_path + "Twinswords/Fallen/SR.webp" },

];