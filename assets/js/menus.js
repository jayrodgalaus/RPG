$(function(){
    $(document)
    .on('click', '.town-btn', function(){
        let screen = $(this).attr('screen');
        if(screen == "enchantress") screen = "tower";
        else if(screen == "pots") screen = "alchemist"
        let screenLabel = "-"+screen.charAt(0).toUpperCase() + screen.slice(1)+"-";
        $('#backgroundLabel').text(screenLabel);
        $('#background').attr('class', nsfw ? screen + " " + "nsfw" : screen);
        if(screen == "forge"){
            resetForge();
            populateEqpList("forge");
        }else if(screen == "storage"){
            if(activeRefiner){
                if(nsfw)
                    $('#background.storage').css({"background-image": 'url("'+activeRefiner.img+'")'});
                $('#refinerPaymentInfo').text(`Pay refiner ${activeRefiner.salary} on run ${nextPayableRun}`)
            }
            $('#storageTabs .nav-link').removeClass('active').attr('aria-selected','false');
            $('#mats-tab').click();
        }
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
    //town menu
    .on('click','.buff-icon-wrapper',function(){
        $(this).prev().toggleClass('d-none')
    })
    //forge
    .on('click','.forge-eqp-btn',function(){
        let idx = parseInt($(this).attr('idx'));
        let array = $(this).attr('array');
        let src = array == "loadout" ? loadOut : (array == "weapons" ? weapons : armor);
        let eqp = src[idx];
        let bg = eqp.eqp.img;
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
    .on('click',"#enhanceBtn", function(){
        if($(this).attr('index') == '-1'){return false;}
        let idx = parseInt($(this).attr('index'));
        let array = $(this).attr('array');
        let src = array == "loadout" ? loadOut : (array == "weapons" ? weapons : armor);
        let eqp = src[idx];
        let tier = eqp.tier;
        let cost = forgeCosts[`${tier}`];
        if(soul.gold >= cost){
            
            eqp.enhance();
            $('#forgeCurrentEnhance').parent().addClass('grow');
            setTimeout(function(){$('#forgeCurrentEnhance').parent().removeClass('grow');},120);
            initStars(eqp.enhancement, tier == "G" ? 5 : 10);
            $('#forgeCurrentEnhance').text(eqp.enhancement);
            $('#forgeAtk').text(eqp.final_atk);
            $('#forgeSpd').text(eqp.final_spd);
            $('#forgeDef').text(eqp.final_def);
            $('#forgeHp').text(eqp.final_hp);
            populateStatMenu()
            
            //deduct gold
            soul.updateGold(soul.gold - cost);
            if(soul.gold < cost){
                $("#enhanceBtn").attr('disabled','disabled');
                $('#forgeCost').addClass('text-danger')
            }else{
                $("#enhanceBtn").removeAttr('disabled');
                $('#forgeCost').removeClass('text-danger');
            }
            setGold();
        }else{
            $("#enhanceBtn").attr('disabled','disabled');
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
            let eqp = inventory[$(this).attr('inventoryIndex')]
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
    //bag menu
    .on('click','#mats-tab',function(){
        populateMatsTab()
    })
    //dungeon menu
    .on('click','#mapMenuDungeonList button',function(){
        $('#mapMenuDungeonList button').removeClass('active');
        $("#floorListContainer").removeClass('invisible');
        $(this).addClass('active');
        currentDungeon = dungeons[$(this).text().toLowerCase()];
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
        startRun()
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
        triggerReward();
        let totalGold = Math.round(soul.gold + collectedGold);
        soul.updateGold(totalGold);
        if(collectedMats.length > 0){
            if(activeRefiner){ applyRefinerBonus();}
            collectedMats.forEach(item =>{
                bag.push(item);
            });
            let compiledMats = compileMats("collected");
            if(compiledMats.length > 0){
                let collectedMatsText = '';
                compiledMats.forEach(drop => {
                    let idx = materialList.findIndex(mat => mat.id === drop.id);
                    let matData = materialList[idx];
                    collectedMatsText += `<span class="icon-btn-text">${matData.name} x${drop.cnt}</span><br>`
                });
                $('#collectedMats').html(collectedMatsText);
            }
            updateBag();
        }
        resetDungeon();
    })


})