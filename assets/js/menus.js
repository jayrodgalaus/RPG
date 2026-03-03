$(function(){
    $(document)
    .on('click', '.town-btn', function(){
        let screen = $(this).attr('screen');
        if(screen == "enchantress") screen = "tower";
        else if(screen == "pots") screen = "alchemist"
        let screenLabel = "-"+screen.charAt(0).toUpperCase() + screen.slice(1)+"-";
        $('#backgroundLabel').text(screenLabel);
        $('#background').attr('class',screen);
        if(screen == "storage" && activeRefiner){
            $('#background.storage').css({"background-image": 'url("'+activeRefiner.img+'")'});
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
        $('#refinerPreviewPanel').css('background-image', `url('${refiner.portrait}')`);
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
    //soul menu interactions
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
    .on('click','#testDungeonBtn, #startRunBtn',function(){
        startRun()
    })

})