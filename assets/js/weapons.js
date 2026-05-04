const weaponTypes = [
   /* 0 */{ type: "Sword", slot:1, atk_chance: 0.30, spd_chance: 0.30, def_chance: 0.20, hp_chance: 0.20 },
   /* 1 */{ type: "Axe", slot:1, atk_chance: 0.40, spd_chance: 0.20, def_chance: 0.25, hp_chance: 0.15 },
   /* 2 */{ type: "Hammer", slot:1, atk_chance: 0.35, spd_chance: 0.10, def_chance: 0.30, hp_chance: 0.25 },
   /* 3 */{ type: "Scythe", slot:1, atk_chance: 0.25, spd_chance: 0.35, def_chance: 0.15, hp_chance: 0.25 },
   /* 4 */{ type: "Twin Swords", slot:1, atk_chance: 0.20, spd_chance: 0.45, def_chance: 0.15, hp_chance: 0.20 },
   /* 5 */{ type: "Greatsword", slot:1, atk_chance: 0.50, spd_chance: 0.10, def_chance: 0.25, hp_chance: 0.15 },
   /* 6 */{ type: "Dagger", slot:1, atk_chance: 0.15, spd_chance: 0.6, def_chance: 0.10, hp_chance: 0.15 },
   /* 7 */{ type: "Spear", slot:1, atk_chance: 0.35, spd_chance: 0.35, def_chance: 0.20, hp_chance: 0.10 }
];
const weaponList = [
    {id: 0, category:"weapon", name: "Sword", type: weaponTypes[0], mob: "Beginner", img: eqp_path + "Sword/Beginner/" },
    {id: 1, category:"weapon", name: "Axe", type: weaponTypes[1], mob: "Beginner", img: eqp_path + "Axe/Beginner/" },
    {id: 2, category:"weapon", name: "Hammer", type: weaponTypes[2], mob: "Beginner", img: eqp_path + "Hammer/Beginner/" },
    {id: 3, category:"weapon", name: "Scythe", type: weaponTypes[3], mob: "Beginner", img: eqp_path + "Scythe/Beginner/" },
    {id: 4, category:"weapon", name: "Twin Swords", type: weaponTypes[4], mob: "Beginner", img: eqp_path + "Twinswords/Beginner/" },
    {id: 5, category:"weapon", name: "Greatsword", type: weaponTypes[5], mob: "Beginner", img: eqp_path + "Greatsword/Beginner/" },
    {id: 6, category:"weapon", name: "Dagger", type: weaponTypes[6], mob: "Beginner", img: eqp_path + "Dagger/Beginner/" },
    {id: 7, category:"weapon", name: "Spear", type: weaponTypes[7], mob: "Beginner", img: eqp_path + "Spear/Beginner/" },
    // Zombies
    {id: 8, category:"weapon", name: "Claws", type: weaponTypes[3], mob: "zombies", img: eqp_path + "Scythe/Zombies/" },
    // Skeleton
    {id: 9, category:"weapon", name: "Sword", type: weaponTypes[0], mob: "skeletons", img: eqp_path + "Sword/Skeletons/" },
    // Kobold
    {id: 10, category:"weapon", name: "Hammer", type: weaponTypes[2], mob: "kobolds", img: eqp_path + "Hammer/Kobold/" },
    {id: 11, category:"weapon", name: "Dagger", type: weaponTypes[6], mob: "kobolds", img: eqp_path + "Dagger/Kobold/" },
    // Goblin
    {id: 12, category:"weapon", name: "Dagger", type: weaponTypes[6], mob: "goblins", img: eqp_path + "Dagger/Goblin/" },
    {id: 13, category:"weapon", name: "Bongo", type: weaponTypes[7], mob: "goblins", img: eqp_path + "Spear/Goblins/" },
    // Arachne
    {id: 14, category:"weapon", name: "Fang", type: weaponTypes[3], mob: "arachne", img: eqp_path + "Scythe/Arachne/" },
    // Ghost
    {id: 15, category:"weapon", name: "Scepter", type: weaponTypes[2], mob: "ghosts", img: eqp_path + "Hammer/Ghost/" },
    // Cultist
    {id: 16, category:"weapon", name: "Dagger", type: weaponTypes[6], mob: "cultists", img: eqp_path + "Dagger/Cultist/" },
    // Fallen
    {id: 17, category:"weapon", name: "Sword", type: weaponTypes[0], mob: "fallen", img: eqp_path + "Sword/Fallen/" },
    {id: 18, category:"weapon", name: "Axe", type: weaponTypes[1], mob: "fallen", img: eqp_path + "Axe/Fallen/" },
    {id: 19, category:"weapon", name: "Twin Swords", type: weaponTypes[4], mob: "fallen", img: eqp_path + "Twinswords/Fallen/" },
    // Angel
    {id: 20, category:"weapon", name: "Shilluk", type: weaponTypes[7], mob: "angels", img: eqp_path + "Spear/Angel/" },
    // Dragon
    {id: 21, category:"weapon", name: "Anuak", type: weaponTypes[7], mob: "dragons", img: eqp_path + "Spear/Dragons/" },
    // Demon
    {id: 22, category:"weapon", name: "Halberd", type: weaponTypes[1], mob: "demons", img: eqp_path + "Axe/Demons/" } // placeholder since demon entry wasn’t defined
    // {id: 23, category:"weapon", name: "???", type: weaponTypes[?], mob: "demons", img: eqp_path + "???" } // placeholder since demon entry wasn’t defined
];


const weaponRecipes = [
    //fallen
    {eqp: weaponList.find(eqp => eqp.id == 17), items: [{20:25},{14:6},{15:6},{16:4},{17:4}], cost: 8000},
    {eqp: weaponList.find(eqp => eqp.id == 18), items: [{20:25},{14:8},{15:4},{16:5},{17:3}], cost: 8000},
    {eqp: weaponList.find(eqp => eqp.id == 19), items: [{20:25},{14:4},{15:9},{16:3},{17:4}], cost: 8000},
    
    //angel
    {eqp: weaponList.find(eqp => eqp.id == 20), items: [{0:2},{20:30},{3:10},{1:10},{16:6},{2:4}], cost: 10000},
    //dragon
    {eqp: weaponList.find(eqp => eqp.id == 21), items: [{0:2},{20:30},{12:10},{11:10},{13:6},{17:4}], cost: 10000},
    //demon
    {eqp: weaponList.find(eqp => eqp.id == 22), items: [{0:2},{20:30},{9:10},{15:10},{8:6},{10:4}], cost: 10000},
    // {name: "Twin Swords",items: [{21:25},{16:10},{17:10}], mob:"demons", type: weaponTypes[4].type},
    
    
    
];