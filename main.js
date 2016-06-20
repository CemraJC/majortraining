
/*

    Game data logic and methods
    - Persistent memory
    - Save and load functionality
    - Document elements (cached queries)

*/


var ms_array = {
    0: ['s', 'c', 'z', 'x'],
    1: ['d', 't', 'th'],
    2: ['n'],
    3: ['m'],
    4: ['r'],
    5: ['l'],
    6: ['ch', 'sh', 'j', 'g'],
    7: ['c', 'g', 'ch', 'q', 'k', 'ng', 'ck'],
    8: ['f', 'ph', 'v'],
    9: ['b', 'p'],
    valid: ['s', 'c', 'z', 'x', 'q', 'd', 't', 'th', 'n', 'm', 'r', 'l', 'ch', 'ck', 'sh', 'ph', 'j', 'g', 'k', 'ng', 'f', 'v', 'b', 'p'],
    multi: ['ch', 'ck', 'sh', 'th', 'ng', 'ph']
}

// Do we need separate elements for each level item??
var elements = new (function() {
    this.__s = { // __selectors - not really meant to be used by programmers
        mainsection: ".maincolumn main",
        menusection: ".menucolumn",
        assistsection: ".assistantcolumn",
        readout: ".menucolumn .readout",
        select: ".menucolumn .select",
        settings: ".menucolumn .settings"
    }

    this.list = {
        text: {
            generated: this.__s.mainsection + " p.generated",
            readout: {
                container: this.__s.readout,
                score: this.__s.readout + " .score",
                highscore: this.__s.readout + " .highscore",
                level: this.__s.readout + " .level",
                levelinfo: this.__s.readout + " .levelinfo"
            },
            select: this.__s.menusection + " .select ul",
            count: this.__s.mainsection + " .numbar span.count"
        },
        buttons: {
            skip: this.__s.mainsection + " .numbar a.skip",
            theme: this.__s.settings + " input[name=theme]",
            reset: this.__s.settings + " input[name=reset]"
        },
        inputs: {
            main: this.__s.mainsection + " input[name=main_input]"
        },
        assistant: {
            main: this.__s.assistsection,
            button: this.__s.assistsection + " .button",
            generate_word_btn: this.__s.assistsection + " .inputs button",
            generate_in_num: this.__s.assistsection + " .inputs input[type=number]",
            generator_output: this.__s.assistsection + " span.generated_word",
            panel: this.__s.assistsection + " .panel",
            reflist: this.__s.assistsection + " .panel table tbody"
        }
    }

    /* INIT ROUTINE */
    this.init = function(obj, lvl){
        obj = obj || this.list;
        lvl = lvl || 1;
        if (lvl > 10) {return false} // Recursion limiter - something has gone pretty wrong.


        for (item in obj){
            if (typeof(obj[item]) == "string") {
                obj[item] = document.querySelector(obj[item]);
            } else if (typeof(obj[item]) == "object") {
                this.init(obj[item], lvl + 1)
            }
        }
    }
    this.init();
})();

var save_file = new (function() {
    // This is the data that gets saved between game states. Functions for manipulating are in save_file.
    this.__appdata__ = {
        storage_key: "major_training_242e9989-ffa2-48b6-8f46-4b7dfc6c590a",
        current_stage: 1,
        current_level: 1,
        current_score: 0,
        expert_scale: 30,
        master_scale: 50,
        assistant_open: false,
        times: [timestamp()],
        dark_theme: false,

        levels: {
            1: {
                format: "2",
                info: "2 digit numbers only",
                highscore: 0,
                pass: 75
            },
            2: {
                format: "3",
                info: "3 digit numbers only",
                highscore: 0,
                pass: 75
            },
            3: {
                format: "2-3",
                info: "2 and 3 digit numbers",
                highscore: 0,
                pass: 75
            },
            4: {
                format: "3|3",
                info: "2 groups of 3 digit numbers",
                highscore: 0,
                pass: 75
            },
            5: {
                format: "4",
                info: "4 digit numbers only",
                highscore: 0,
                pass: 75
            },
            6: {
                format: "2-4|2-4",
                info: "2 groups of 2-4 digit numbers",
                highscore: 0,
                pass: 75
            },
            7: {
                format: "2-3|2-3|2-3|2-3",
                info: "4 groups of 2-3 digit numbers",
                highscore: 0,
                pass: 75
            },
            8: {
                format: "4|3|3",
                info: "Phone numbers",
                highscore: 0,
                pass: 75
            },
            9: {
                format: "5|5|5|5|5",
                info: "Credit card numbers",
                highscore: 0,
                pass: 75
            },
            10: {
                format: "40",
                info: "40 digit mega numbers",
                highscore: 0,
                pass: 75
            }
        },
    }

    this.save = function() {
        console.log("Saving:", this.__appdata__);
        window.localStorage.setItem(this.__appdata__.storage_key, JSON.stringify(this.__appdata__));
    }

    this.load = function() {
        var read = JSON.parse(window.localStorage.getItem(this.__appdata__.storage_key));
        if (typeof(read) == "object" && read !== null) {
            this.__appdata__ = read;
        } else {
            this.save();
        }
    }
    this.get = function(key) {
        return (this.__appdata__[key] === undefined) ? false : this.__appdata__[key];
    }
    this.set = function(key, value) {
        if (typeof(key) == 'object' && !value) {
            for (i in key){
                this.__appdata__[i] = key[i]
            }
        } else {
            this.__appdata__[key] = value;
        }
        this.save();
    }
    this.reset = function(){
        window.localStorage.removeItem(this.__appdata__.storage_key);
    }

    this.init = function(){
        this.load();
        var a = this.__appdata__.levels;
        for (i in a){
            a[i].state = function(){
                if (this.highscore >= (this.pass + save_file.get("master_scale"))) {
                    return 4
                } else if (this.highscore >= (this.pass + save_file.get("expert_scale"))) {
                    return 3
                } else if (this.highscore >= this.pass) {
                    return 2
                };
                switch (this.highscore) {
                    case 0:
                        return 0
                    default:
                        return 1
                }
            }
        }
    }
    this.init()
})();


/*

    Display Methods
    - replace and get content
    - toggle the theme
    - build the level-select list
    - select a level

*/


var display = new (function() {
    this.getContentProperty = function(element){
        if (element.nodeName == "INPUT") {
            return 'value'
        } else {
            return 'innerHTML'
        }
    }

    this.replaceElementContent = function(element, content) {
        element[this.getContentProperty(element)] = content;
    }

    this.getElementContent = function(element) {
        return element[this.getContentProperty(element)];
    }

    this.toggleAttribute = function(element, attribute) {
        if (element.getAttribute(attribute) !== null) {
            element.removeAttribute(attribute);
        } else {
            element.setAttribute(attribute, '');
        }
    }

    this.replaceOrGetContent = function(element, content) {
        if (content === undefined){
            return this.getElementContent(element);
        } else {
            this.replaceElementContent(element, content);
            return true;
        }
    }

    this.updateReadout = function(){
        var obj = {
            current_level: save_file.get('current_level'),
            current_score: save_file.get('current_score')
        }
        obj.level = save_file.get('levels')[obj.current_level];

        this.score(obj.current_score)
        this.highscore( obj.level.highscore)
        this.level("Level " + obj.current_level)
        this.levelinfo(obj.level.info)
        return true;
    }

    this.counter = function() {
        var read = parseInt(elements.list.text.count.innerHTML) || 0;
        elements.list.text.count.innerHTML = read + 1;
    }

    this.toggleTheme = function() {
        var a = document.body.getAttribute('dark');
        if(a == false || a == undefined){
            document.body.setAttribute('dark', true)
        } else {
            document.body.removeAttribute('dark');
        }
    }

    this.toggleAssistant = function() {
        this.toggleAttribute(elements.list.assistant.main, "hidden");
    }

    this.getReferenceItem = function(number) {
        return ms_array[number].join(", ") || "?";
    }

    this.getMenuItem = function(level_num) {
        var obj = save_file.get('levels')[level_num], s;
        if (save_file.get('current_level') == level_num){
            s = "selected";
        } else {
            s = "";
        }

        return "<li " + s + " levelnum='" + level_num + "'><h4>Level " + level_num + "<span>" + obj.highscore + "</span></h4>\n<small>" + obj.info + "</small><span progression=\"" + obj.state() + "\"></span></li>\n";
    }

    this.selectMenuItem = function(level_num, override){
        // If these were separate, would have to pass them around in an object and probably save which one?? (maybe just init)
        var current = document.querySelector('li[selected]') || elements.list.text.select.firstChild,
            next = document.querySelector('li[levelnum="' + level_num + '"]');

        if ((current == next || !next) && !override) {
            return false
        } else {
            current.removeAttribute('selected');
            next.setAttribute('selected', '');
            return true
        };
    }

    this.getMenuList = function() {
        var obj = save_file.get('levels'),
            list = "";

        for (i in obj) {
            list += this.getMenuItem(i);
        }
        return list
    }

    this.getReferenceList = function() {
        var list = "";
        for (var i = 0; i <= 9; i++) {
            list += "<tr><td>" + i + "</td> <td>" + this.getReferenceItem(i) + "</td></tr>";
        };
        return list;
    }

    this.updateReferenceList = function() {
        this.reflist(this.getReferenceList());
    }
    this.updateMenuList = function() {
        this.select(this.getMenuList());
    }


    /* Notification / Feedback system */
    this.mainGlow = function(color){
        if (!color) { return false; }

        // Ultra Jank Animation of some properties

        elements.list.inputs.main.style.transition = 'none';
        elements.list.inputs.main.style.boxShadow = '0 0 0.5em ' + color + ' inset';
        setTimeout(function(){
            elements.list.inputs.main.style.transition = "all 2s";
        }, 20);
        setTimeout(function(){
            elements.list.inputs.main.style.boxShadow = '';
        }, 40);
        return true;
    }
    this.goodGlow = function(){
        this.mainGlow("#3A8900");
    };
    this.badGlow = function(){
        this.mainGlow("#B31500");
    };


    /* Element specifics are auto-generated on init */
    this.__generateSpecifics = function(obj, lvl) {
        obj = obj || elements.list;
        lvl = lvl || 1;
        if (lvl > 10) { return false; }

        for (i in obj) {
            try {
                var valid = obj[i].nodeType;
            } catch(e) {
                console.error("Element selctor problem:", i, e);
            }
            if (valid !== undefined) {
                this[i] = new Function('content', 'return this.replaceOrGetContent(this.' + i + '__element, content);');
                this[i + "__element"] = obj[i];
            } else {
                this.__generateSpecifics(obj[i], lvl + 1);
            }
        }
    }



    this.init = function(){
        this.__generateSpecifics()
        if ( save_file.get('dark_theme') ) { this.toggleTheme() }
        if ( save_file.get('assistant_open') ) { this.toggleAssistant() }
        this.updateMenuList();
        this.updateReferenceList();
        this.updateReadout();
        this.selectMenuItem(save_file.get('current_level'), true);
    }
    this.init();

})();

var inputs = new (function(){
    this.themeListener = function(){
        save_file.set('dark_theme', !save_file.get('dark_theme'));
        display.toggleTheme();
    }

    this.assistantListener = function(e){
        display.toggleAssistant();
    }

    this.assistantGeneratorListener = function(e){
        var word = WordGenerator.getWordFromNum(display.generate_in_num());
        display.generator_output(word);
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
            display.main('');
            game.generateNum();
            display.updateReadout();
            fontScale.recalculate();
        }
    }

    this.mainInputListener = function(e){
        if (e.code == "Enter") {
            var check = display.replaceOrGetContent(elements.list.text.generated.firstChild) || display.generated();
            if (game.checkNum(check, display.main())){
                display.main('');
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
        elements.list.buttons.theme.addEventListener('click', this.themeListener);
        elements.list.buttons.reset.addEventListener('click', this.resetListener);
        elements.list.buttons.skip.addEventListener('click', this.skipListener);

        elements.list.text.select.addEventListener('click', this.levelSelectListener);
        elements.list.inputs.main.addEventListener('keyup', this.mainInputListener);

        elements.list.assistant.button.addEventListener('click', this.assistantListener);
        elements.list.assistant.generate_word_btn.addEventListener('click', this.assistantGeneratorListener);
    }

    this.init();
})();

var game = new (function(){

    this.ms = ms_array;

    this.generateWord = 'bung';
    this.generateNum = function() {
        display.generated(this.__generateNumFromFormat(save_file.get('levels')[save_file.get('current_level')].format));
    }

    this.__generateNumFromFormat = function(format){
        format = format || "2-12"
        var groups = format.split('|');
        var result = [];

        for (var i = 0; i < groups.length; i++) {
            var digit_range = groups[i].split('-');
            result[i] = this.__generateDigitGroup(digit_range);
        };

        return result.join(' ');
    }
    this.__generateDigitGroup = function(range) {
        var single_digit, result = "";
        if (!range[1]) { range[1] = range[0]; }
        var break_probability = 1 / (range[1] - range[0] + 1);

        for (var i = 1; i <= range[1]; i++) {
            single_digit = Math.round(Math.random()*9);
            result += single_digit;
            if (i >= range[0] && Math.random() <= break_probability) {
                break;
            };
        };

        return result;
    }

    this.checkNum = function(num, word) {
        letters = this.__wordToLetters(word);
        var possible_num = [];
        for (var i = 0; i < letters.length; i++) {
            if ( this.ms.valid.indexOf(letters[i]) < 0 ) { continue; }
            possible_num.push(game.__letterToNums(letters[i]));
        };
        return this.__matchPossibleNum(num, possible_num);
    }

    this.__wordToLetters = function(word) {
        exploded = removeSuccessiveDuplicates(word.trim().toLowerCase().split(''));
        var letters = [],
            index;

        for (var i = 0; i < exploded.length; i++) {
            index = this.ms.multi.indexOf(exploded[i] + exploded[i + 1]);
            if (index >= 0) {
                letters.push(this.ms.multi[index]);
                i++ // Skip the already-processed letter
            } else {
                letters.push(exploded[i])
            }
        };

        return letters
    }
    this.__letterToNums = function(letter) {
        nums = [];
        for (i in this.ms) {
            if (i >= 0 && this.ms[i].indexOf(letter) >= 0) {
                nums.push(i);
            }
        };
        return nums;
    }
    this.__matchPossibleNum = function(num, possible_num){
        exploded_num = num.split('');
        if (exploded_num.length != possible_num.length) {
            return false;
        }
        for (var i = 0; i < exploded_num.length; i++) {
            if (possible_num[i].indexOf(exploded_num[i]) < 0){
                return false
            }
        };
        return true;
    }

    this.addTimestamp = function(){
        save_file.get('times').push(timestamp());
    }

    this.updateScore = function(){
        var obj = {
            current_score: save_file.get('current_score'),
            levels: save_file.get('levels'),
            times: save_file.get('times')
        };
        var level_i = save_file.get('current_level');
        obj.current_score = this.__calculateScore(obj)
        // Set high score if current is higher
        if (obj.current_score > obj.levels[level_i].highscore){
            obj.levels[level_i].highscore = obj.current_score;
        }
        save_file.set(obj);
    }

    this.__calculateScore = function(obj) {
        var MAX_PAST = 4;
        var scaler = display.generated().length,
            timelen = obj.times.length,
            pastinterval = Math.max(Math.min(MAX_PAST, timelen), 1),
            timediff = (obj.times[timelen-1] - obj.times[timelen-pastinterval]) / 1000,
            wpm = Math.round(Math.min(Math.max((60)/(timediff/pastinterval), 1), 300));

        if (timelen > MAX_PAST){
            obj.times = obj.times.slice(-5);
        }

        if (pastinterval <= 2){
            return 10;
        }
        return Math.max(Math.round(wpm*scaler), 0);
    }

    this.init = function(){
        this.generateNum();
    }
    this.init()

})();


/* UTILITY FUNCTIONS */

function reload() {
    window.location.reload();
}

function removeSuccessiveDuplicates(array){
    var result = []
    for (var i = 0; i < array.length; i++) {
        if(array[i-1] != array[i]){
            result.push(array[i]);
        }
    };
    return result
}

function timestamp(){
    return Math.floor(Date.now() / 1)
}

// Shim for unsupporting browsers
if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}