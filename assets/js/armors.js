const armorTypes = [
    { type: "Shield", slot: 2, atk_chance: 0.10, spd_chance: 0.05, def_chance: 0.55, hp_chance: 0.30 },
    { type: "Helmet", slot: 3,     atk_chance: 0.15, spd_chance: 0.20, def_chance: 0.35, hp_chance: 0.30 },
    { type: "Breastplate", slot: 4,atk_chance: 0, spd_chance: 0.10, def_chance: 0.50, hp_chance: 0.40 },
    { type: "Gloves", slot: 5,     atk_chance: 0.25, spd_chance: 0.40, def_chance: 0.20, hp_chance: 0.15 },
    { type: "Greaves", slot: 6,    atk_chance: 0.10, spd_chance: 0.30, def_chance: 0.30, hp_chance: 0.30 }
];
const armorList = [
    //Beginner
    /* 0 */{id: 0, category:"armor", name: "Helmet", type: armorTypes[1], img: eqp_path+"Helmet/Beginner/", mob:"Beginner"},
    /* 1 */{id: 1, category:"armor", name: "Breastplate", type: armorTypes[2], img: eqp_path+"Breastplate/Beginner/", mob:"Beginner"},
    /* 2 */{id: 2, category:"armor", name: "Gloves", type: armorTypes[3], img: eqp_path+"Gloves/Beginner/", mob:"Beginner"},
    /* 3 */{id: 3, category:"armor", name: "Greaves", type: armorTypes[4], img: eqp_path+"Greaves/Beginner/", mob:"Beginner"},
    //Goblin
    {id: 4, category:"armor", name: "Breastplate", type: armorTypes[2], img: eqp_path+"Breastplate/Goblin/", mob:"goblins"},
    //Kobolds
    {id: 5, category:"armor", name: "Robe", type: armorTypes[2], img: eqp_path+"Breastplate/Kobold/", mob:"kobolds"},
    //Zombies
    {id: 6, category:"armor", name: "Coffin Lid", type: armorTypes[0], img: eqp_path+"Shield/Zombie/", mob:"zombies"},
    //Skeletons

    //Ghosts

    //Arachne

    //Cultist

    //Fallen
    {id: 7, category:"armor", name: "Shield", type: armorTypes[0], img: eqp_path+"Shield/Fallen/", mob:"fallen"},
    {id: 8, category:"armor", name: "Helmet", type: armorTypes[1], img: eqp_path+"Helmet/Fallen/", mob:"fallen"},
    {id: 9, category:"armor", name: "Breastplate", type: armorTypes[2], img: eqp_path+"Breastplate/Fallen/", mob:"fallen"},
    {id: 10, category:"armor", name: "Gloves", type: armorTypes[3], img: eqp_path+"Gloves/Fallen/", mob:"fallen"},
    {id: 11, category:"armor", name: "Greaves", type: armorTypes[4], img: eqp_path+"Greaves/Fallen/", mob:"fallen"},
    //Angels
    {id: 12, category:"armor", name: "Wings", type: armorTypes[0], img: eqp_path+"Shield/Angels/", mob:"angels"},
    {id: 13, category:"armor", name: "Halo", type: armorTypes[1], img: eqp_path+"Helmet/Angels/", mob:"angels"},
    // {id: 14, category:"armor", name: "Wings", type: armorTypes[0], img: eqp_path+"Shield/Angels/", mob:"angels"},
    // {id: 15, category:"armor", name: "Halo", type: armorTypes[1], img: eqp_path+"Helmet/Angels/", mob:"angels"},
    // {id: 16, category:"armor", name: "Halo", type: armorTypes[1], img: eqp_path+"Helmet/Angels/", mob:"angels"},
    //Demons

    //Dragons
];
const armorRecipes = [
    //fallen
    {id:1,eqp:armorList.find(eqp => eqp.id == 7),items: [{21:25},{14:1},{15:1},{16:10},{17:8}], cost: 12000},
    {id:2,eqp:armorList.find(eqp => eqp.id == 8),items: [{21:25},{14:2},{15:4},{16:7},{17:7}], cost: 12000},
    {id:3,eqp:armorList.find(eqp => eqp.id == 9),items: [{21:25},{15:1},{16:10},{17:9}], cost: 12000},
    {id:4,eqp:armorList.find(eqp => eqp.id == 10),items: [{21:25},{14:2},{15:4},{16:7},{17:7}], cost: 12000},
    {id:5,eqp:armorList.find(eqp => eqp.id == 11),items: [{21:25},{16:10},{17:10}], cost: 12000},
    //angel
    {id:6,eqp:armorList.find(eqp => eqp.id == 12),items: [{3:35},{1:3},{15:1},{16:17},{2:9}], cost: 15000},
    {id:7,eqp:armorList.find(eqp => eqp.id == 13),items: [{3:35},{1:4},{15:6},{16:11},{2:9}], cost: 15000},
    //demon

    //dragon
    
];