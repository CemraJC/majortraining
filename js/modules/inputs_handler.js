var inputs = new (function(){
    this.themeListener = function(){
        save_file.set('dark_theme', !save_file.get('dark_theme'));
        display.toggleTheme();
    }

    this.assistantListener = function(e){
        display.toggleAssistant();
    }

    this.assistantGeneratorListener = function(e){
        var word = WordGenerator.getWord(display.modify.assistantGeneratorNumber());
        display.modify.assistantGeneratorOutput(word);
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
        if (e.code == "Enter") {
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

        elements.list.assistant.toggler.addEventListener('click', this.assistantListener);
        elements.list.assistant.generator.word.addEventListener('click', this.assistantGeneratorListener);
    }
})();