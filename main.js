
/*

    Game data logic and methods
    - Persistent memory
    - Save and load functionality
    - Document elements (cached queries)

*/

// Do we need separate elements for each level item??
var elements = new (function() {
    this.__s = { // __selectors - not really meant to be used by programmers
        mainsection: ".maincolumn main",
        menusection: ".menucolumn",
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
            select: this.__s.menusection + " .select ul"
        },
        buttons: {
            skip: this.__s.mainsection + " .skip a",
            theme: this.__s.settings + " input[name=theme]",
            reset: this.__s.settings + " input[name=reset]"
        },
        inputs: {
            main: this.__s.mainsection + " input[name=main_input]"
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
        times: [timestamp()],
        dark_theme: false,

        levels: {
            1: {
                format: "2",
                info: "2 digit numbers only",
                highscore: 0,
                pass: 220
            },
            2: {
                format: "3",
                info: "3 digit numbers only",
                highscore: 0,
                pass: 340
            },
            3: {
                format: "2-3",
                info: "2 and 3 digit numbers",
                highscore: 0,
                pass: 280
            },
            4: {
                format: "3|3",
                info: "2 groups of 3 digit numbers",
                highscore: 0,
                pass: 500
            },
            5: {
                format: "4",
                info: "4 digit numbers only",
                highscore: 0,
                pass: 300
            },
            6: {
                format: "2-4|2-4",
                info: "2 groups of 2-4 digit numbers",
                highscore: 0,
                pass: 450
            },
            7: {
                format: "2-3|2-3|2-3|2-3",
                info: "4 groups of 2-3 digit numbers",
                highscore: 0,
                pass: 600
            },
            8: {
                format: "4|3|3",
                info: "Phone numbers",
                highscore: 0,
                pass: 650
            },
            9: {
                format: "5|5|5|5|5",
                info: "Credit card numbers",
                highscore: 0,
                pass: 750
            },
            10: {
                format: "20|20",
                info: "40 digit mega numbers",
                highscore: 0,
                pass: 800
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
                if (this.highscore >= this.pass) {
                    return true
                };
                switch (this.highscore) {
                    case 0:
                        return null
                    default:
                        return false
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

        /* NEED TO REPLACE WITH SPECIFICS */
        this.replaceElementContent(elements.list.text.readout.score, obj.current_score)
        this.replaceElementContent(elements.list.text.readout.highscore, obj.level.highscore)
        this.replaceElementContent(elements.list.text.readout.level, "Level " + obj.current_level)
        this.replaceElementContent(elements.list.text.readout.levelinfo, obj.level.info)
        return true;
    }

    this.toggleTheme = function() {
        var a = document.body.getAttribute('dark');
        if(a == false || a == undefined){
            document.body.setAttribute('dark', true)
        } else {
            document.body.removeAttribute('dark');
        }
    }

    this.getMenuItem = function(level_num) {
        var obj = save_file.get('levels')[level_num], s;
        if (save_file.get('current_level') == level_num){
            s = "selected";
        }

        return "<li " + s + " levelnum='" + level_num + "'><h4>Level " + level_num + "<span>" + obj.highscore + "</span></h4>\n<small>" + obj.info + "</small><span " + obj.state() + "></span></li>\n";
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

    this.updateMenuList = function() {
        this.replaceElementContent(elements.list.text.select, this.getMenuList());
    }

    /* Element specifics are auto-generated on init */
    this.__generateSpecifics = function(obj, lvl) {
        obj = obj || elements.list;
        lvl = lvl || 1;
        if (lvl > 10) { return false; }

        for (i in obj) {
            if (obj[i].nodeType !== undefined) {
                this[i] = function(content){
                    console.log(this)
                    this.replaceOrGetContent(bung , content);
                }
                this[i].bung = obj[i];
            } else {
                this.__generateSpecifics(obj[i], lvl + 1);
            }
        }
    }


    this.init = function(){
        // this.__generateSpecifics()
        if ( save_file.get('dark_theme') ) { this.toggleTheme() }
        this.updateMenuList();
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
            display.replaceElementContent(elements.list.inputs.main, '');
            game.generateNum();
            display.updateReadout();
            fontScale.recalculate();
        }
    }

    this.mainInputListener = function(e){
        if (e.code == "Enter") {
            var check = display.replaceOrGetContent(elements.list.text.generated.firstChild) || display.replaceOrGetContent(elements.list.text.generated);
            if (game.checkNum(check, display.replaceOrGetContent(elements.list.inputs.main))){
                display.replaceElementContent(elements.list.inputs.main, '');
                game.generateNum();
                game.addTimestamp();
                game.updateScore();
                display.updateReadout();
                display.updateMenuList();
            } else {
                /* NEED NOTIFICATIONS */
                console.log("Nope, soz");
            }
        }
    }

    this.init = function(){
        elements.list.buttons.theme.addEventListener('click', this.themeListener);
        elements.list.buttons.reset.addEventListener('click', this.resetListener);
        elements.list.buttons.skip.addEventListener('click', this.skipListener);
        elements.list.text.select.addEventListener('click', this.levelSelectListener);
        elements.list.inputs.main.addEventListener('keyup', this.mainInputListener);
    }

    this.init();
})();

var game = new (function(){

    this.ms = {
        0: ['s', 'c', 'z'],
        1: ['d', 't', 'th'],
        2: ['n'],
        3: ['m'],
        4: ['r'],
        5: ['l'],
        6: ['ch', 'sh', 'j', 'g'],
        7: ['c', 'g', 'ch', 'k', 'ng', 'ck'],
        8: ['f', 'v'],
        9: ['b', 'p'],
        valid: ['s', 'c', 'z', 'd', 't', 'th', 'n', 'm', 'r', 'l', 'ch', 'ck', 'sh', 'j', 'g', 'k', 'ng', 'f', 'v', 'b', 'p'],
        multi: ['ch', 'ck', 'sh', 'th',  'ng']
    }

    this.generateWord = 'bung';
    this.generateNum = function() {
        display.replaceElementContent(elements.list.text.generated, this.__generateNumFromFormat(save_file.get('levels')[save_file.get('current_level')].format));
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
            score: save_file.get('current_score'),
            level: save_file.get('levels')[save_file.get('current_level')],
            times: save_file.get('times')
        };
        obj.score = this.__calculateScore(obj)
        // Set high score if current is higher
        if (obj.score > obj.level.highscore){
            save_file.get('levels')[save_file.get('current_level')].highscore = obj.score;
        }
        save_file.set('current_score', obj.score);
    }

    this.__calculateScore = function(obj) {
        var scaler = display.replaceOrGetContent(elements.list.text.generated).length,
            timelen = obj.times.length,
            pastinterval = Math.max(Math.min(4, timelen), 1),
            timediff = (obj.times[timelen-1] - obj.times[timelen-pastinterval]) / 1000,
            wpm = Math.round(Math.min(Math.max((60)/(timediff/pastinterval), 1), 300));
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