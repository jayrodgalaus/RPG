$(function(){
    $(document)
    .on('click', '.town-btn', function(){
        let screen = $(this).attr('screen');
        if(screen == "enchantress") screen = "tower";
        else if(screen == "pots") screen = "alchemist"
        let screenLabel = "-"+screen.charAt(0).toUpperCase() + screen.slice(1)+"-";
        $('#backgroundLabel').text(screenLabel);
        $('#background').attr('class',screen);
        $('.menu').addClass('d-none');
        $('#'+screen+"Menu").removeClass('d-none');
        if(screen != "town"){
            $('#townMenuLeft.visible, #townMenuBottom.visible, #townMenuRight.visible').removeClass('visible')
        }else{
            setTimeout(function(){$('#townMenuLeft, #townMenuBottom, #townMenuRight').addClass('visible')},100);
            
        }
    })
    .on('click','.toggle-menu-btn',function(){
        console.log($(this).attr("toggledOn"))
        if($(this).attr("toggledOn") == "true"){ // menu on
            $(this).parent().siblings().hide();
            $(this).children('i').removeClass('fa-eye').addClass('fa-eye-slash');
            $(this).attr("toggledOn",false)
        }else{
            $(this).parent().siblings().show();
            $(this).children('i').removeClass('fa-eye-slash').addClass('fa-eye');
            $(this).attr("toggledOn",true)
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
        $(this).addClass('active');
        currentDungeon = dungeons[$(this).text().toLowerCase()];
        $('#mapMenuFloorList button').removeClass('active');
        currentFloor = 0;
    })
    .on('click','#mapMenuFloorList button',function(){
        if(currentDungeon != "town" && $('#mapMenuDungeonList button.active').length == 1 ){
            $('#mapMenuFloorList button').removeClass('active');
            $(this).addClass('active');
            currentFloor = parseInt($(this).attr('floor'));
            spawnMob()
        }
        
    })

})