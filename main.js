
/*

    Game data logic and methods
    - Persistent memory
    - Save and load functionality
    - Document elements (cached queries)

*/

// This is the data that gets saved between game states. Functions for manipulating are in save_file.
var __appdata__ = {
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

var __selectors__ = {
        mainsection: ".maincolumn main",
        menusection: ".menucolumn",
        readout: ".menucolumn .readout",
        select: ".menucolumn .select",
        settings: ".menucolumn .settings"
    }

var elements = {
    text: {
        generated: __selectors__.mainsection + " p.generated",
        readout: {
            score: __selectors__.readout + " .score",
            highscore: __selectors__.readout + " .highscore",
            level: __selectors__.readout + " .level",
            levelinfo: __selectors__.readout + " .levelinfo"
        },
        level_select: __selectors__.menusection + " .select ul"
    },
    buttons: {
        skip: __selectors__.mainsection + " .skip a",
        theme: __selectors__.settings + " input[name=theme]",
        reset: __selectors__.settings + " input[name=reset]"
    },
    inputs: {
        main: __selectors__.mainsection + " input[name=main_input]"
    }
}

var save_file = {
    save: function() {
        console.log("Saving:", __appdata__);
        window.localStorage.setItem(__appdata__.storage_key, JSON.stringify(__appdata__));
    },
    load: function() {
        var read = JSON.parse(window.localStorage.getItem(__appdata__.storage_key));
        if (typeof(read) == "object") {
            __appdata__ = read;
        }
    },
    get: function(key) {
        return (__appdata__[key] === undefined) ? false : __appdata__[key];
    },
    set: function(key, value) {
        __appdata__[key] = value;
        this.save();
    },
    reset: function(){
        window.localStorage.removeItem(__appdata__.storage_key);
    }
}


/*

    Display Methods

    - replace and get content

*/


var display = {
    replaceElementContent: function(element, content) {
        element.innerHTML = content;
    },
    getElementContent: function(element) {
        return element.innerHTML;
    },
    replaceOrGetContent: function(element, content) {
        if (content === undefined){
            return this.getElementContent(element);
        } else {
            this.replaceElementContent(element, content);
            return true;
        }
    },
    toggleTheme: function() {
        (document.body.dark === undefined) ? document.body.setAttribute('dark', true) : document.body.removeAttribute('dark');
    },

    getMenuItem: function(level_num) {
        var obj = save_file.get('levels')[level_num], status;
        return "<li><h4>Level " + level_num + "<span>" + obj.highscore + "</span></h4>\n<small>" + obj.info + "</small><span " + obj.state + "></span></li>\n";
    },

    getMenuList: function() {
        var obj = save_file.get('levels');
        var list = "";
        console.log(obj);
        for (i in obj) {
            list += this.getMenuItem(i);
        }
        return list
    }

    /* Element specifics are auto-generated on init*/
}

document.addEventListener('DOMContentLoaded', function(){
    console.log(display.getMenuList());
})
