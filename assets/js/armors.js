const armorTypes = [
    { type: "Shield", slot: 2, atk_chance: 0.10, spd_chance: 0.05, def_chance: 0.55, hp_chance: 0.30 },
    { type: "Helmet", slot: 3,     atk_chance: 0.15, spd_chance: 0.20, def_chance: 0.35, hp_chance: 0.30 },
    { type: "Breastplate", slot: 4,atk_chance: 0, spd_chance: 0.10, def_chance: 0.50, hp_chance: 0.40 },
    { type: "Gloves", slot: 5,     atk_chance: 0.25, spd_chance: 0.40, def_chance: 0.20, hp_chance: 0.15 },
    { type: "Greaves", slot: 6,    atk_chance: 0.10, spd_chance: 0.30, def_chance: 0.30, hp_chance: 0.30 }
];
const armorList = [
    //Beginner
    /* 0 */{category:"armor", name: "Helmet", type: armorTypes[1], img: eqp_path+"Helmet/Beginner/", mob:"Beginner"},
    /* 1 */{category:"armor", name: "Breastplate", type: armorTypes[2], img: eqp_path+"Breastplate/Beginner/", mob:"Beginner"},
    /* 2 */{category:"armor", name: "Gloves", type: armorTypes[3], img: eqp_path+"Gloves/Beginner/", mob:"Beginner"},
    /* 3 */{category:"armor", name: "Greaves", type: armorTypes[4], img: eqp_path+"Greaves/Beginner/", mob:"Beginner"},
    //Goblin
    {category:"armor", name: "Breastplate", type: armorTypes[2], img: eqp_path+"Breastplate/Goblin/", mob:"goblins"},
    //Kobolds
    {category:"armor", name: "Robe", type: armorTypes[2], img: eqp_path+"Breastplate/Kobold/", mob:"kobolds"},
    //Zombies
    {category:"armor", name: "Coffin Lid", type: armorTypes[1], img: eqp_path+"Shield/Zombie/", mob:"zombies"},
    //Skeletons

    //Ghosts

    //Cultist

    //Fallen
    {category:"armor", name: "Shield", type: armorTypes[0], img: eqp_path+"Shield/Fallen/", mob:"fallen"},
    {category:"armor", name: "Helmet", type: armorTypes[1], img: eqp_path+"Helmet/Fallen/", mob:"fallen"},
    {category:"armor", name: "Breastplate", type: armorTypes[2], img: eqp_path+"Breastplate/Fallen/", mob:"fallen"},
    {category:"armor", name: "Gloves", type: armorTypes[3], img: eqp_path+"Gloves/Fallen/", mob:"fallen"},
    {category:"armor", name: "Greaves", type: armorTypes[4], img: eqp_path+"Greaves/Fallen/", mob:"fallen"},

];