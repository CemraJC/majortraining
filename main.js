// This is the save file DATA. Functions are in the other one.
var __save_file__ = {
    storage_key: "major_training6123537497129",
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

    get: function(key) {

    },
    set: function(key, value) {
        this[key] = value;
        this.save();
    },
    save: function() {
        console.log(this);
        window.localStorage.setItem(this.storage_key, JSON.stringify(this));
    },
    reset: function(){
        window.localStorage.removeItem(this.storage_key);
    }
}
