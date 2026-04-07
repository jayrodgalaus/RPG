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
    {category:"weapon", name: "Sword", type: weaponTypes[0], mob: "Beginner", img: eqp_path + "Sword/Beginner/" },
    {category:"weapon", name: "Axe", type: weaponTypes[1], mob: "Beginner", img: eqp_path + "Axe/Beginner/" },
    {category:"weapon", name: "Hammer", type: weaponTypes[2], mob: "Beginner", img: eqp_path + "Hammer/Beginner/" },
    {category:"weapon", name: "Scythe", type: weaponTypes[3], mob: "Beginner", img: eqp_path + "Scythe/Beginner/" },
    {category:"weapon", name: "Twin Swords", type: weaponTypes[4], mob: "Beginner", img: eqp_path + "Twinswords/Beginner/" },
    {category:"weapon", name: "Greatsword", type: weaponTypes[5], mob: "Beginner", img: eqp_path + "Greatsword/Beginner/" },
    {category:"weapon", name: "Dagger", type: weaponTypes[6], mob: "Beginner", img: eqp_path + "Dagger/Beginner/" },
    {category:"weapon", name: "Spear",	type: weaponTypes[7], mob: "Beginner", img: eqp_path + "Spear/Beginner/" },
    //Zombies
    {category:"weapon", name: "Claws", type: weaponTypes[3], mob: "zombies", img: eqp_path + "Scythe/Zombies/" },
    //Kobold
    {category:"weapon", name: "Hammer", type: weaponTypes[2], mob: "kobolds", img: eqp_path + "Hammer/Kobold/" },
    {category:"weapon", name: "Dagger", type: weaponTypes[6], mob: "kobolds", img: eqp_path + "Dagger/Kobold/" },
    //Goblin
    {category:"weapon", name: "Dagger", type: weaponTypes[6], mob: "goblins", img: eqp_path + "Dagger/Goblin/" },
    //Arachne
    {category:"weapon", name: "Fang", type: weaponTypes[3], mob: "arachne", img: eqp_path + "Scythe/Arachne/" },
    //Ghost
    {category:"weapon", name: "Scepter", type: weaponTypes[2], mob: "ghosts", img: eqp_path + "Hammer/Ghost/" },
    //Cultist
    {category:"weapon", name: "Dagger", type: weaponTypes[6], mob: "cultists", img: eqp_path + "Dagger/Cultist/" },
    //Fallen
    {category:"weapon", name: "Axe", type: weaponTypes[1], mob: "fallen", img: eqp_path + "Axe/Fallen/" },
    {category:"weapon", name: "Twin Swords", type: weaponTypes[4], mob: "fallen", img: eqp_path + "Twinswords/Fallen/" },
];