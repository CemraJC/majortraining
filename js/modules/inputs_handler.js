var inputs = new (function(){
    this.themeListener = function(){
        save_file.set('dark_theme', !save_file.get('dark_theme'));
        display.toggleTheme();
    }

    this.generateNums = function(e){
        var nums = game.explodePossibleNumToNums(game.possibleNumFromWord(display.modify.generatorInputWord())),
            tail = (nums.length > 3) ? "..." : "",
            inputElement = elements.list.generator.input.word;

        if (!nums) {
            inputElement.placeholder = inputElement.value;
            display.modify.generatorInputWord('');
            return false;
        }

        display.modify.generatorOutputNums(nums.splice(0, 3).join(', ') + tail);
        inputElement.placeholder = inputElement.value;
        display.modify.generatorInputWord('');
    }

    this.generateNumsListener = function(e) {
        if (e.keyCode === 13) {
            this.generateNums();
        }
    }

    this.generateWordListener = function(e){
        if ((e.type == "keyup" && e.keyCode === 13) || e.type == "click") {
            var word = WordGenerator.getWord(display.modify.generatorInputNumber());
            display.modify.generatorOutputWord(word);
        }
    }

    this.tabsListener = function(e){
        var a = elements.list.input.tabs;
        setTimeout(function(){
            for (var i = 0; i < a.length; i++){
                if (a[i].checked) {
                    save_file.set('tab_selected', a[i].value)
                }
            }
        }, 50)
    }

    this.drawerListener = function(e){
        var state = elements.list.input.drawer.checked;
        if (state) {
            save_file.set('drawer_open', true);
        } else {
            save_file.set('drawer_open', false);
        }
        setTimeout(function(){
            fontScale.recalculate();
        }, 325)
    }

    this.skipListener = function(e){
        game.generate();
    }

    this.resetListener = function(e){
        if (e.detail >= 2) {
            save_file.reset();
            WordGenerator.clearDictionaryFromLocalStorage();
            reload();
        }
    }

    this.stageSelectListener = function(e) {
        var clicked = this.reverseDomSearch(e.target, "LABEL"),
            next_stage = clicked.getAttribute("for").match(/\d$/)[0];
        if (save_file.get('current_stage') !== next_stage) {
            save_file.set({
                current_stage: next_stage,
                current_level: 1
            });
            display.selectLevel(next_stage, 1, true);
            display.updateReadout();
            display.updateLevelsLists();
            display.counter(0);
            game.generate();
        }
    }

    this.levelSelectListener = function(e) {
        var clicked = this.reverseDomSearch(e.target, "LI"),
            new_level = clicked.getAttribute('levelnum');
        if (!clicked) { return false; }
        if (display.selectLevel(save_file.get('current_stage'), new_level)) {
            save_file.set({
                current_score: 0,
                current_level: new_level,
                times: []
            });
            display.modify.inputMain('');
            display.counter(0);
            game.generate();
            display.updateReadout();
            fontScale.recalculate();
        }
    }

    this.reverseDomSearch = function(element, target_element_name) {
        var target_element;
        for (var i = 0; i < 3; i++) {
            if (element.nodeName === target_element_name){
                target_element = element;
                break;
            } else {
                element = element.parentElement;
            }
        }
        if (!element) {
            return false;
        } else {
            return element;
        }
    }

    // This is messy...
    this.mainInputListener = function(e){
        if (e.keyCode === 13) {
            if (e.shiftKey) {
                game.generate();
                return true;
            }
            var check = display.replaceOrGetContent(elements.list.text.main.firstChild) || display.modify.textMain();
            if (save_file.get('current_stage') == 1) {
                if (game.checkNum(check, display.modify.inputMain())){
                    display.modify.inputMain('');
                    display.goodGlow();
                    display.counter();

                    game.generate();
                    game.addTimestamp();
                    game.updateScore();

                    display.updateReadout();
                    display.updateLevelsLists([1, 2]);
                    fontScale.recalculate();
                } else {
                    display.badGlow();
                }
            } else if (save_file.get('current_stage') == 2) {
                if (game.checkWord(check, display.modify.inputMain())) {
                    display.modify.inputMain('');
                    display.goodGlow();
                    display.counter();

                    game.generate();
                    game.addTimestamp();
                    game.updateScore();

                    display.updateReadout();
                    display.updateLevelsLists([1, 2]);
                    fontScale.recalculate();
                } else {
                    display.badGlow();
                }
            }
        }
    }

    this.init = function(){
        elements.list.button.theme.addEventListener('click', this.themeListener);
        elements.list.button.reset.addEventListener('click', this.resetListener);
        elements.list.button.skip.addEventListener('click', this.skipListener);

        elements.list.text.select.stage1.list.addEventListener('click', this.levelSelectListener.bind(this));
        elements.list.text.select.stage2.list.addEventListener('click', this.levelSelectListener.bind(this));
        elements.list.text.select.stage1.button.addEventListener('click', this.stageSelectListener.bind(this));
        elements.list.text.select.stage2.button.addEventListener('click', this.stageSelectListener.bind(this));

        elements.list.generator.word.addEventListener('click', this.generateWordListener);
        elements.list.generator.nums.addEventListener('click', this.generateNums);
        elements.list.generator.input.word.addEventListener('keyup', this.generateNumsListener.bind(this));
        elements.list.generator.input.number.addEventListener('keyup', this.generateWordListener.bind(this));

        elements.list.input.main.addEventListener('keyup', this.mainInputListener);
        elements.list.input.drawer.addEventListener('click', this.drawerListener);
        elements.list.input.tab_labels.addEventListener('click', this.tabsListener);
    }
})();