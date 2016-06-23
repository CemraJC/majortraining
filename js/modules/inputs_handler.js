var inputs = new (function(){
    this.themeListener = function(){
        save_file.set('dark_theme', !save_file.get('dark_theme'));
        display.toggleTheme();
    }

    this.generatorListener = function(e){
        var word = Wordgenerator.getWord(display.modify.generatorNumber());
        display.modify.generatorOutput(word);
    }

    this.drawerListener = function(e){
        var state = elements.list.input.drawer.checked;
        if (state) {
            save_file.set('drawer_open', true);
        } else {
            save_file.set('drawer_open', false);
        }
    }

    this.skipListener = function(e){
        game.generateNum();
    }

    this.resetListener = function(e){
        console.log(e)
        if (e.detail >= 2) {
            save_file.reset();
            reload();
        }
    }

    this.levelSelectListener = function(e) {
        var clicked, target = e.target;

        for (var i = 0; i < 3; i++) {
            if (target.nodeName == "LI"){
                clicked = target;
                break
            } else {
                target = target.parentElement;
            }
        }
        if (!clicked) { return false; }

        var new_level = clicked.getAttribute('levelnum');
        if (display.selectMenuItem(new_level)) {
            save_file.set({
                current_score: 0,
                current_level: new_level
            });
            save_file.set('times', [])
            display.modify.inputMain('');
            game.generateNum();
            display.updateReadout();
            fontScale.recalculate();
        }
    }

    this.mainInputListener = function(e){
        if (e.keyCode == 13) {
            var check = display.replaceOrGetContent(elements.list.text.main.firstChild) || display.modify.textMain();
            if (game.checkNum(check, display.modify.inputMain())){
                display.modify.inputMain('');
                display.goodGlow();
                display.counter();

                game.generateNum();
                game.addTimestamp();
                game.updateScore();

                display.updateReadout();
                display.updateMenuList();
                fontScale.recalculate();
            } else {
                display.badGlow();
            }
        }
    }

    this.init = function(){
        elements.list.button.theme.addEventListener('click', this.themeListener);
        elements.list.button.reset.addEventListener('click', this.resetListener);
        elements.list.button.skip.addEventListener('click', this.skipListener);

        elements.list.text.select.addEventListener('click', this.levelSelectListener);
        elements.list.input.main.addEventListener('keyup', this.mainInputListener);

        elements.list.generator.word.addEventListener('click', this.generatorListener);
        elements.list.input.drawer.addEventListener('click', this.drawerListener);
    }
})();