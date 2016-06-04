
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
})()

var save_file = new (function() {
    // This is the data that gets saved between game states. Functions for manipulating are in save_file.
    this.__appdata__ = {
        storage_key: "major_training_242e9989-ffa2-48b6-8f46-4b7dfc6c590a",
        current_stage: 1,
        current_level: 1,
        current_score: 0,
        dark_theme: false,

        levels: {
            1: {
                format: "2",
                info: "2 digit numbers only",
                highscore: 0,
                state: false
            },
            2: {
                format: "3",
                info: "3 digit numbers only",
                highscore: 0,
                state: null
            },
            3: {
                format: "2-3",
                info: "2 and 3 digit numbers",
                highscore: 0,
                state: null
            },
            4: {
                format: "3|3",
                info: "2 groups of 3 digit numbers",
                highscore: 0,
                state: null
            },
            5: {
                format: "4",
                info: "4 digit numbers only",
                highscore: 0,
                state: null
            },
            6: {
                format: "2-4|2-4",
                info: "2 groups of 2-4 digit numbers",
                highscore: 0,
                state: null
            },
            7: {
                format: "2-3|2-3|2-3|2-3",
                info: "4 groups of 2-3 digit numbers",
                highscore: 0,
                state: null
            },
            8: {
                format: "4|3|3",
                info: "Phone numbers",
                highscore: 0,
                state: null
            },
            9: {
                format: "5|5|5|5|5",
                info: "Credit card numbers",
                highscore: 0,
                state: null
            },
            10: {
                format: "40",
                info: "40 digit mega numbers",
                highscore: 0,
                state: null
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
        this.__appdata__[key] = value;
        this.save();
    }
    this.reset = function(){
        window.localStorage.removeItem(this.__appdata__.storage_key);
    }

    /* INIT ROUTINE */
    this.load()
})()


/*

    Display Methods
    - replace and get content
    - toggle the theme
    - build the level-select list
    - select a level

*/


var display = new (function() {

    this.replaceElementContent = function(element, content) {
        element.innerHTML = content;
    }
    this.getElementContent = function(element) {
        return element.innerHTML;
    }
    this.replaceOrGetContent = function(element, content) {
        if (content === undefined){
            return this.getElementContent(element);
        } else {
            this.replaceElementContent(element, content);
            return true;
        }
    }

    this.toggleTheme = function() {
        (document.body.dark === undefined) ? document.body.setAttribute('dark', true) : document.body.removeAttribute('dark');
    }

    this.getMenuItem = function(level_num) {
        var obj = save_file.get('levels')[level_num],
            status;

        return "<li levelnum='" + level_num + "'><h4>Level " + level_num + "<span>" + obj.highscore + "</span></h4>\n<small>" + obj.info + "</small><span " + obj.state + "></span></li>\n";
    }

    this.selectMenuItem = function(level_num){
        // If these were separate, would have to pass them around in an object and probably save which one?? (maybe just init)
        var current = document.querySelector('li[selected]'),
            next = document.querySelector('li[levelnum="' + level_num + '"]');

        if (current == next || !next) {
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

    this.buildMenuList = function() {
        this.replaceElementContent(elements.text.select, this.getMenuList());
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
    }
    this.init();

})()

