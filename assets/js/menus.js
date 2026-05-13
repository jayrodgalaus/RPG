$(function(){
    
    
    $(document)
    .on('click','#startGameBtn',function(){
        $('#fakeLoad').remove();
        let bgm = $('#backgroundMusic')[0];
        bgm.loop = true;
        // bgm.play();
    })
    .on('click','.changeClass',function(){
        let id = $(this).attr('id');
        let idx = parseInt($(this).attr('idx'));
        let currentClass;
        if(id == 'prevClass'){
            if(idx == 0){
                $(this).attr('idx',classList.length-1)
            }else{
                $(this).attr('idx',idx-1);
            }
            let otherIdx = parseInt($('#nextClass').attr('idx'));
            if(otherIdx == 0){
                $('#nextClass').attr('idx',classList.length-1)
            }else{
                $('#nextClass').attr('idx',otherIdx-1);
            }
        }else{
            if(idx == classList.length-1){
                $(this).attr('idx',0)
            }else{
                $(this).attr('idx',idx+1);
            }
            let otherIdx = parseInt($('#prevClass').attr('idx'));
            if(otherIdx == classList.length-1){
                $('#prevClass').attr('idx',0)
            }else{
                $('#prevClass').attr('idx',otherIdx+1);
            }
        }
        $('#classSelection').attr('classIdx',idx);
        currentClass = classList[idx];
        let classImg = `${soul_path}${currentClass.name}_M.webp`;
        $('#male').addClass('active');
        $('#female').removeClass('active');
        $('#classSelection').css({'background-image':`url('${classImg}')`});
        let specialIdx = classAbilities.findIndex(ability => ability.class == currentClass.name && ability.gender == 'M');
        let special = classAbilities[specialIdx];
        $('#className').text(currentClass.name)
        $('#classSpecialName').text(special.name);
        $('#classSpecialDesc').text(special.desc);
        $('#selectClassBtn').attr('idx',specialIdx);
    })
    .on('click','.gender-btn',function(){
        $('.gender-btn').toggleClass('active');
        let idx = parseInt($('#classSelection').attr('classIdx'));
        let currentClass = classList[idx];
        let gender = $(this).attr('id');
        let srcImg = `${soul_path}${currentClass.name}_`;
        let classImg, specialIdx;
        if(gender == 'male'){
            classImg = `${srcImg}M.webp`;
            specialIdx = classAbilities.findIndex(ability => ability.class == currentClass.name && ability.gender == 'M');
        }else{
            classImg = `${srcImg}F.webp`;
            specialIdx = classAbilities.findIndex(ability => ability.class == currentClass.name && ability.gender == 'F');
        }
        let special = classAbilities[specialIdx];
        $('#classSelection').css({'background-image':`url('${classImg}')`});
        $('#className').text(currentClass.name)
        $('#classSpecialName').text(special.name);
        $('#classSpecialDesc').text(special.desc);
        $('#selectClassBtn').attr('idx',specialIdx);
    })
    .on('click','#selectClassBtn',async function(){
        $(this).attr('disabled',true);
        $(this).text('Creating soul');
        soul = await createSoul(parseInt($(this).attr('idx')));
        await initSoulDependent();
        $('#classSelection').remove();
        
    })
    .on('click', '.town-btn', function(){
        let screen = $(this).attr('screen');
        if(screen == "enchantress") screen = "tower";
        else if(screen == "pots") screen = "alchemist"
        let screenLabel = "-"+screen.charAt(0).toUpperCase() + screen.slice(1)+"-";
        
        $('#background').attr('class', nsfw ? screen + " " + "nsfw" : screen);
        if(screen == "soul"){
            $('#background').removeClass('soul');
            $('#background').css({'background-image':`url('${soul.img}')`})
            populateStatMenu();
        }else if(screen == "forge"){
            resetForge();
            populateEqpList("forge");
            populateCraftList();
        }else if(screen == "tower"){
            resetTower();
            populateEqpList("tower");
            populateMatsList();
        }else if(screen == 'guild'){
            populateRefinerMenu();
        }else if(screen == "storage"){
            if(activeRefiner){
                if(nsfw)
                    $('#background.storage').css({"background-image": 'url("'+activeRefiner.img+'")'});
                $('#refinerPaymentInfo').text(`Pay refiner ${activeRefiner.salary} on run ${nextPayableRun}`)
            }
            $('#storageTabs .nav-link').removeClass('active').attr('aria-selected','false');
            $('#mats-tab').click();
        }else if(screen=="armory"){
            initLoadOut();
        }else if(screen=="map"){
            if($('#non-interactable').find('.hitsfx').length == 0){
                $('#non-interactable').append(`
                    <audio src="assets/audio/hit1.wav" id="hitsfx1" class="hitsfx" preload="auto"></audio>
                    <audio src="assets/audio/hit2.wav" id="hitsfx2" class="hitsfx" preload="auto"></audio>
                    <audio src="assets/audio/hit3.wav" id="hitsfx3" class="hitsfx" preload="auto"></audio>
                    <audio src="assets/audio/death.wav" id="deathsfx" preload="auto"></audio>`);
            }
        }else if(screen == "maidens"){
            screenLabel = "";
            populateMaidenMenu();
        }
        // $('#backgroundLabel').text(screenLabel);
        $('.menu').addClass('d-none');
        $('#'+screen+"Menu").removeClass('d-none');
        if(screen != "town"){
            $('#townMenuLeft.visible, #townMenuBottom.visible, #townMenuRight.visible').removeClass('visible')
        }else{
            $('#background').removeAttr('style');
            setTimeout(function(){$('#townMenuLeft, #townMenuBottom, #townMenuRight').addClass('visible')},100);
            
        }
    })
    .on('click','.toggle-menu-btn',function(){
        if($(this).attr("toggledOn") == "true"){ // menu on
            $(this).parent().siblings().addClass('d-none');
            $(this).children('i').removeClass('fa-eye').addClass('fa-eye-slash');
            $(this).attr("toggledOn",false)
        }else{
            $(this).parent().siblings().removeClass('d-none');
            $(this).children('i').removeClass('fa-eye-slash').addClass('fa-eye');
            $(this).attr("toggledOn",true)
        }
    })
    .on('click', '.toggle-preview-section-container', function(){
        $(this).parent().toggleClass('hidden')
        $(this).siblings().toggleClass('d-none')
        $(this).find('i').toggleClass('fa-caret-down fa-caret-up');
        $(this).closest('.offcanvas').find('.icon-btn[aria-label="Close"]').toggleClass('hidden')
    })
    .on('click', '.menu button',function(){
        let sfx = $('#clicksfx')[0];
        sfx.volume = 0.3;
        sfx.currentTime = 0; // rewind instantly
        sfx.play();
    })
    //town menu
    .on('click','.buff-icon-wrapper',function(){
        $(this).prev().toggleClass('d-none')
    })
    //forge
    .on('click','.forge-eqp-btn',function(){
        $('#forgeStatsCont .text-E').removeClass('text-E');
        let idx = parseInt($(this).attr('idx'));
        let array = $(this).attr('array');
        let src = array == "loadout" ? loadOut : (array == "weapons" ? weapons : armor);
        let eqp = src[idx];
        let bg = eqp.img;
        let tier = eqp.tier;
        $('#forgeEqpPreview').css({'background-image':`url('${bg}')`});
        $('#forgeCurrentEnhance').text(eqp.enhancement);
        $('.forge-eqp-btn').removeClass('active')
        $(this).addClass('active');
        $('#enhanceBtn').attr('index',idx).attr("array",array);
        initStars(eqp.enhancement, tier == "G" ? 5 : 10);
        $('#forgeAtk').text(eqp.final_atk);
        $('#forgeSpd').text(eqp.final_spd);
        $('#forgeDef').text(eqp.final_def);
        $('#forgeHp').text(eqp.final_hp);
        let cost = forgeCosts[`${tier}`];
        if(soul.gold < cost){
            $("#enhanceBtn").attr('disabled','disabled');
            $('#forgeCost').addClass('text-danger')
        }else{
            $("#enhanceBtn").removeAttr('disabled');
            $('#forgeCost').removeClass('text-danger')
        }
        $('#forgeCost').text(cost);
    })
    .on('click', ".toggle-craft-btn",function(){
        let target = $(this).attr('target');
        if(target == 'forge'){
            $('#craftSubmenu').addClass('d-none');
            $('#forgeSubmenu').removeClass('d-none');
        }else{
            $('#forgeSubmenu').addClass('d-none');
            $('#craftSubmenu').removeClass('d-none');
        }
        $(".toggle-craft-btn").removeClass('active');
        $('.craft-item').removeClass('active');
        $(this).addClass('active')
    })
    .on('click','.craft-item',function(){
        $('.craft-item').removeClass('active');
        $(this).addClass('active');
        let recipe = recipesPerMob[parseInt($(this).attr('mob'))][parseInt($(this).attr('idx'))];
        populateRecipematList(recipe);

        $("#craftEqpPreview").css({'background':$(this).css('background')})
        $("#craftItemName").text(recipe.eqp.name);
        $("#craftCost").text(recipe.cost);
        
        
        
    })
    .on('click', '#craftBtn',function(){
        let active = $('.craft-item.active');
        let mobidx = parseInt(active.attr('mob'));
        let idx = parseInt(active.attr('idx')); 
        let recipe = recipesPerMob[mobidx][idx];
        craftEqp(recipe);
    })
    .on('click',"#enhanceBtn", function(){
        if($(this).attr('index') == '-1'){return false;}
        let idx = parseInt($(this).attr('index'));
        let array = $(this).attr('array');
        let src = array == "loadout" ? loadOut : (array == "weapons" ? weapons : armor);
        let eqp = src[idx];
        let tier = eqp.tier;
        let cost = forgeCosts[`${tier}`];
        if(soul.gold >= cost){
            
            eqp.enhance(cost);
            $('#forgeCurrentEnhance').parent().addClass('grow');
            setTimeout(function(){$('#forgeCurrentEnhance').parent().removeClass('grow');},120);
            initStars(eqp.enhancement, tier == "G" ? 5 : 10);
            $('#forgeCurrentEnhance').text(eqp.enhancement);
            // $('#forgeAtk').text(eqp.final_atk);
            // $('#forgeSpd').text(eqp.final_spd);
            // $('#forgeDef').text(eqp.final_def);
            // $('#forgeHp').text(eqp.final_hp);
            populateStatMenu()
            
            
            if(soul.gold < cost){
                $("#enhanceBtn").attr('disabled','disabled');
                $('#forgeCost').addClass('text-danger')
            }else{
                $("#enhanceBtn").removeAttr('disabled');
                $('#forgeCost').removeClass('text-danger');
            }
        }else{
            $("#enhanceBtn").attr('disabled','disabled');
        }
    })
    //tower
    .on('click','.tower-eqp-btn',function(){
        let idx = parseInt($(this).attr('idx'));
        let array = $(this).attr('array');
        let src = array == "loadout" ? loadOut : (array == "weapons" ? weapons : armor);
        let eqp = src[idx];
        let bg = eqp.img;
        let tier = eqp.tier;
        $('#enchantEqpPreview').css({'background-image':`url('${bg}')`});
        $('#enchantCurrentEnhance').text(eqp.enchantment);
        $('.tower-eqp-btn').removeClass('active')
        $(this).addClass('active');
        $('#enchantBtn').attr('index',idx).attr("array",array);
        let maxStars = 3;
        switch(tier){
            case "G": maxStars = 3; break;
            case "F": maxStars = 4; break;
            case "E": maxStars = 5; break;
            case "D": maxStars = 6; break;
            case "C": maxStars = 7; break;
            case "B": maxStars = 8; break;
            case "A": maxStars = 9; break;
            case "S": maxStars = 10; break;
            case "SR": maxStars = 12; break;
        }
        initStars(eqp.enchantment, maxStars);
        $('#enchantAtk').text(eqp.final_atk);
        $('#enchantSpd').text(eqp.final_spd);
        $('#enchantDef').text(eqp.final_def);
        $('#enchantHp').text(eqp.final_hp);
        let cost = enchantCosts[`${tier}`];
        if((soul.gold < cost) || (!$("#enchantBtn").attr("m-index")) || ($("#enchantBtn").attr("m-index") == '-1')){
            $("#enchantBtn").attr('disabled','disabled');
            $('#enchantCost').addClass('text-danger')
        }else{
            $("#enchantBtn").removeAttr('disabled');
            $('#enchantCost').removeClass('text-danger')
        }
        $('#enchantCost').text(cost);
    })
    .on('click','.tower-mat-btn',function(){
        let btnidx = $("#enchantBtn").attr('index');
        if(!btnidx || btnidx == '-1'){alert("Select equipment first.");return false;}
        $('.tower-mat-btn').removeClass('active');
        $(this).addClass('active');
        $("#enchantBtn").attr("m-index",$(this).attr('idx'));
        
        let idx = parseInt(btnidx);
        let array = $("#enchantBtn").attr('array');
        let src = array == "loadout" ? loadOut : (array == "weapons" ? weapons : armor);
        let eqp = src[idx];
        let tier = eqp.tier;
        let cost = enchantCosts[`${tier}`];
        if((soul.gold < cost) || (!$("#enchantBtn").attr("index")) || ($("#enchantBtn").attr("index") == '-1')){
            $("#enchantBtn").attr('disabled','disabled');
            $('#enchantCost').addClass('text-danger')
        }else{
            $("#enchantBtn").removeAttr('disabled');
            $('#enchantCost').removeClass('text-danger')
        }
        $('#enchantCost').text(cost);
    })
    .on('click',"#enchantBtn", function(){
        if($(this).attr('index') == '-1'){alert("Select equipment first.");return false;}
        if($(this).attr('m-index') == '-1'){alert("Select material first.");return false;}
        let idx = parseInt($(this).attr('index'));
        let array = $(this).attr('array');
        let src = array == "loadout" ? loadOut : (array == "weapons" ? weapons : armor);
        let eqp = src[idx];
        let tier = eqp.tier;
        let cost = enchantCosts[`${tier}`];
        let midx = $(this).attr('m-index');
        if(soul.gold >= cost){
            
            eqp.enchant(tier,midx, cost);
            $('#enchantCurrentEnhance').parent().addClass('grow');
            setTimeout(function(){$('#enchantCurrentEnhance').parent().removeClass('grow');},120);
            let maxStars = 3;
            switch(tier){
                case "G": maxStars = 3; break;
                case "F": maxStars = 4; break;
                case "E": maxStars = 5; break;
                case "D": maxStars = 6; break;
                case "C": maxStars = 7; break;
                case "B": maxStars = 8; break;
                case "A": maxStars = 9; break;
                case "S": maxStars = 10; break;
                case "SR": maxStars = 12; break;
            }
            initStars(eqp.enchantment, maxStars);
            $('#enchantCurrentEnhance').text(eqp.enchantment);
            $('#enchantAtk').text(eqp.final_atk);
            $('#enchantSpd').text(eqp.final_spd);
            $('#enchantDef').text(eqp.final_def);
            $('#enchantHp').text(eqp.final_hp);
            populateStatMenu()
            
            //deduct gold
            
            if(soul.gold < cost){
                $("#enchantBtn").attr('disabled','disabled');
                $('#enchantCost').addClass('text-danger')
            }else{
                $("#enchantBtn").removeAttr('disabled');
                $('#enchantCost').removeClass('text-danger');
            }
            
        }else{
            $("#enchantBtn").attr('disabled','disabled');
        }
    })

    // refiner menu
    .on('click','#guildBtn',function(){
        if(activeRefiner){$('#buffEffectDisplay').text(activeRefiner.description);}
        else{$('#buffEffectDisplay').text("None");}
        checkHireBtnStatus();
    })
    .on('click','.hire-refiner-btn',function(){
        if($(this).is('.hired')){return;}
        let idx = $(this).closest('.refiner-container').attr('refinerIndex');
        let refiner = refiners[idx];
        if(soul.gold < refiner.salary){
            $(this).attr('disabled','disabled');
        }else{
            hireRefiner(idx);
            $('#refinerHireRun').text(refinerHireRun)
            $("#refinerBuffIcon").removeClass('d-none');
            $('.hire-refiner-btn.hired').removeClass('hired btn-warning').addClass('btn-light');
            $(this).html("<strong>Active</strong>").addClass('hired btn-warning').removeClass('btn-light');
            $('#buffEffectDisplay').text(refiner.description);
            $('.hire-refiner-btn').not('.hired').each(function(index, btn) {
                const $btn = $(btn);
                const btnSalary = $btn.attr('salary'); // assuming you stored salary in data-salary
                $btn.html("<strong>" + btnSalary + "g</strong>");
            });
            checkHireBtnStatus()

        }
    })
    .on('click', '.refiner-portrait',function(){
        let idx = $(this).closest('.refiner-container').attr('refinerIndex');
        let refiner = refiners[idx];
        $('#refinerPreviewName').text(refiner.name);
        $('#refinerPreviewDetails').text(refiner.buff.description);
        $('#refinerPreviewSalary').text(refiner.salary+"g")
        $('#refinerPreviewPanel').css('background-image', `url('${refiner.portrait+(nsfw ? '-nsfw.webp':'.webp')}')`);
        $('#refinerPreviewPanel').attr('refinerPreviewId',idx)
        if(refiner.bonus){
            const video = $('#refinerPreviewBonusVid')[0];
            $(video).find('source').remove(); // clear old sources
            $(video).append(`<source src="${refiner.bonus.path}" type="video/webm">`);
            video.load();

        }else{
            const video = $('#refinerPreviewBonusVid')[0];
            $(video).find('source').remove(); // clear old sources
            $(video).append(`<source src="" type="video/webm">`);
            video.load();
        }
    })
    .on('click', '.refinerPreviewBonus', function(){
        let idx = $('#refinerPreviewPanel').attr('refinerPreviewId');
        if(activeRefiner && activeRefinerIndex == idx){
            $('#refinerBonusContainer').toggleClass('d-none');
            if($(this).hasClass('stop')){
                const vid = $('#refinerPreviewBonusVid')[0];
                vid.pause(); vid.currentTime = 0;
            }            
            else
                document.getElementById('refinerPreviewBonusVid').play();
        }else{
            alert("Refiner not active.")
        }
    })
    .on('click','#refinerPreviewBonusVid',function(){
        const vid = $('#refinerPreviewBonusVid')[0];
        vid.pause(); vid.currentTime = 0;
        document.getElementById('refinerPreviewBonusVid').play();
    })
    //soul menu interactions
    .on('click','#nsfwTrigger', function(){
        $('#nsfwTrigger > i').toggleClass('text-danger pulse');
        $('#background').toggleClass('nsfw');
        nsfw = !nsfw;
        populateRefinerMenu();
    })
    .on('click', '#saveStats', function(){
        let atk = parseInt($('#baseAtk').text());
        let spd = parseInt($('#baseSpd').text());
        let def = parseInt($('#baseDef').text());
        let hp = parseInt($('#baseHP').text());
        let availableStats = parseInt($('#availableStats').text());
        soul.setStats(atk, spd, def, hp, availableStats);
    })
    .on('click', '.stat-btn', function() {
        const statToUpdate = $(this).siblings('.base-stat').attr('id');
        let delta = $(this).hasClass('subtract-stat') ? -1 : 1;

        // Prevent adding if no points left
        if (delta > 0 && soul.availableStats === 0) {
            return;
        }

        let updated = false;
        switch (statToUpdate) {
            case 'baseAtk':
                if (soul.atk + delta >= 5) {
                    soul.atk += delta;
                    updated = true;
                }
                break;
            case 'baseSpd':
                if (soul.spd + delta >= 0) {
                    soul.spd += delta;
                    updated = true;
                }
                break;

            case 'baseDef':
                if (soul.def + delta >= 0) {
                    soul.def += delta;
                    updated = true;
                }
                break;

            case 'baseHP':
                if (soul.hp + delta >= 5) {
                    soul.hp += delta;
                    updated = true;
                }
                break;
        }

        if (updated) {
            soul.availableStats -= delta;

            // Reflect changes in DOM
            $('#baseAtk').text(soul.atk);
            $('#baseSpd').text(soul.spd);
            $('#baseDef').text(soul.def);
            $('#baseHP').text(soul.hp);
            
            $('#availableStats').text(soul.availableStats);
            calcTotalStats();
            populateStatMenu()
        }
    })
    //inventory menu interactions
    .on('click','.equipment-slot',function(){
        if(!($(this).attr('isEmpty') == false)){
            let eqp = inventory.find(eqp => eqp.id == $(this).attr('eqpid'))
            if(eqp) {
                currentEqpPreview = eqp;
                previewEqp(currentEqpPreview)
            }
        }else{
            $("#eqpPreviewPanel").css('background-image', '');
            $("#eqpPreviewName").text('');
            $(".eqpPreview-stat").text("0");
            $("#toggleEquip").hide();
        }
    })
    .on('click',"#toggleEquip",function(){
        currentEqpPreview.toggleEquip();
    })
    .on('click',"#eqpToggleEquip",function(){
        currentEqpPreview.toggleEquip();
    })
    .on('click', '.eqp-list-toggle', function(){
        let array = $(this).attr('array');
        $("#eqpTypeLabel").text(capitalize(array))
        $("#eqpListInfo, #eqpListPreview").addClass('d-none');
        populateInvEqpList(array);
    })
    .on('click', '#eqpWeaponToggle', function(){
        populateWeaponList();
    })
    .on('click', '#eqpArmorToggle', function(){
        populateWeaponList();
    })
    .on('click', '.eqp-list-btn',function(){
        $('.eqp-list-btn').removeClass('active');
        $(this).addClass('active');
        let idx = parseInt($(this).attr('idx'));
        let src = $(this).attr('array') == 'weapons' ? weapons : armor;
        let eqp = src[idx];
        if(eqp) {
            currentEqpPreview = eqp;
            previewEqp(currentEqpPreview, true)
        }
    })
    .on('click', '#eqpDestroy', function(){
        let eqpId = $('.eqp-list-btn.active').attr('eqpId');
        let eqp = inventory.find(eqp => eqp.id == eqpId);
        if(eqp.isEquipped){
            triggerModal("","Can't destroy eqp that is currently equipped");
            return false;
        }
        let array = $('.eqp-list-btn.active').attr('array');
        let eqpIdx = inventory.findIndex(eqp => eqp.id == eqpId);
        if(eqp.eqp.category == "weapon"){
            // if(eqp.eqp.)
        }
        //remove
        inventory.splice(eqpIdx,1);
        populateInvEqpList(array)
        updateInventory();

    })
    //bag menu
    .on('click','#mats-tab',function(){
        populateMatsTab()
    })
    //dungeon menu
    .on('click','#dungeonStatsBtn',function(){
        let crit = "0%";
        if(calcSpd > 430){crit = ((calcSpd - 430)/10).toFixed(2)+"%";}
        
        let stats = [
            {"Current Run": currentRun},
            {"Mob Rate": ((baseMobSpawnRate + refinerMobSpawnBuff())*100)+"%"},
            {"Mob Spawn Buff": (refinerMobSpawnBuff()*100)+"%"},
            {"ATK":calcAtk},
            {"DMG":calcDmg},
            {"SPD":calcSpd},
            {"APS":((1/calcAtkspd).toFixed(2))+"/s"},
            {"DEF":calcDef},
            {"HP":calcHP},
            {"HP Points":calcHppoints},
            {"Crit": crit},
        ];
        if(activeRefiner){
            stats.push({"Refiner":activeRefiner.name});
            stats.push({"Refiner Buff":activeRefiner.buff.description});
            stats.push({"refinerHireRun":refinerHireRun});
            stats.push({"refinerPaidRun":refinerPaidRun});
            stats.push({"nextPayableRun":nextPayableRun});
        }
        let content = `<ul class="list-group list-group-flush">`;
        stats.forEach(item => {
            const [key, value] = Object.entries(item)[0];
            content += `<li class="list-group-item list-group-item-light map-menu-btn p-0 small-text">
                <b>${key}:</b>&nbsp${value}
            </li>`;
        })
        //
        //                   
        content +=`</ul>`;
        triggerModal("Dungeon Stats",content,null,null,null,"50vh");
    })
    .on('click','.changeMap',function(){
        $('#floorListContainer').addClass('invisible')
        let id = $(this).attr('id');
        let idx = parseInt($(this).attr('idx'));
        let currentMap;
        if(id == 'prevMap'){
            if(idx == 0){
                $(this).attr('idx',maps.length-1)
            }else{
                $(this).attr('idx',idx-1);
            }
            let otherIdx = parseInt($('#nextMap').attr('idx'));
            if(otherIdx == 0){
                $('#nextMap').attr('idx',maps.length-1)
            }else{
                $('#nextMap').attr('idx',otherIdx-1);
            }
        }else{
            if(idx == maps.length-1){
                $(this).attr('idx',0)
            }else{
                $(this).attr('idx',idx+1);
            }
            let otherIdx = parseInt($('#prevMap').attr('idx'));
            if(otherIdx == maps.length-1){
                $('#prevMap').attr('idx',0)
            }else{
                $('#prevMap').attr('idx',otherIdx+1);
            }
        }
        currentMap = maps[idx];
        $('#mapName').text(currentMap)
        let mapImg = `assets/img/Backgrounds/map_${idx}.webp`;
        $('#background').css({'background-image':`url('${mapImg}')`});
        $('.map-menu-btn').addClass('d-none');
        $('.map-menu-btn[mapidx="'+idx+'"]').removeClass('d-none');
        let prereq;
        let prereqfloor = 10;
        switch(idx){
            case 2: prereq = ['zombies','skeletons','ghosts']; break;
            case 3: prereq = ['arachne','cultists','fallen']; prereqfloor = 20; break;
            case 4: prereq = ['angels','demons','dragons']; prereqfloor = 30; break;
        }
        if(prereq){
            let unlocked = true;
            prereq.forEach(dungeon => {
                if(dungeons[dungeon].maxFloor <= prereqfloor){
                    unlocked = false;
                }
            });
            if(unlocked){
                $('.map-menu-btn[mapidx="'+idx+'"]').removeAttr('disabled');
            }
        }
        
        
    })
    .on('click','#mapMenuDungeonList button',function(){
        $('#mapMenuDungeonList button').removeClass('active');
        $("#floorListContainer").removeClass('invisible');
        $(this).addClass('active');
        currentDungeon = dungeons[$(this).text().toLowerCase()];
        populateDungeonFloors();
        $('#mapMenuFloorList button').removeClass('active');
        currentFloor = 0;
    })
    .on('click','#mapMenuFloorList button',function(){
        if(currentDungeon != "town" && $('#mapMenuDungeonList button.active').length == 1 ){
            $('#mapMenuFloorList button').removeClass('active');
            $(this).addClass('active');
            $('#startRunBtn').removeClass('invisible');
            currentFloor = parseInt($(this).attr('floor'));
            currentRoom = 0;
            // spawnMob()
        }
    })
    .on('click','#startRunBtn',function(){
        currentDungeon = dungeons[$('#mapMenuDungeonList button.active').text().toLowerCase()];
        currentFloor = parseInt($('#mapMenuFloorList button.active').attr('floor'));
        if(!currentDungeon || !currentFloor || currentFloor == 0){
            return false;
        }
        startRun();
    })
    .on('click','#startBossBtn, #startApexBtn',function(){
        bossFight();
    })
    .on('click','#testDungeonBtn, .next-room-btn',function(){
        nextRoom();
    })
    .on('click','#resetDunBtn',function(){
        triggerTransition();
        resetDungeon();
    })
    .on('click','.escape-btn',function(){
        triggerReward(false,true);
    })
    //maiden menu
    .on('click', '.maiden-portrait',function(){
        let idx = $(this).closest('.maiden-container').attr('maidenIndex');
        showMaidenInfo(idx);
    })

})