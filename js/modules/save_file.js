
var save_file = new (function() {
    // This is the data that gets saved between game states. Functions for manipulating are in save_file.
    this.__appdata__ = {
        storage_key: "major_training_242e9989-ffa2-48b6-8f46-4b7dfc6c590a",
        current_stage: 1,
        current_level: 1,
        current_score: 0,
        expert_scale: 30,
        master_scale: 50,
        drawer_open: false,
        tab_selected: "1",
        times: [timestamp()],
        dark_theme: false,

        levels: {
            stage1: {
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
            stage2: {
                1: {
                    format: "2-3",
                    info: "1 word with 2 or 3 digits",
                    highscore: 0,
                    pass: 75
                },
                2: {
                    format: "2-3|2-3",
                    info: "2 words with 2 or 3 digits each",
                    highscore: 0,
                    pass: 75
                },
                3: {
                    format: "2-5",
                    info: "2 to 5 digits in one word",
                    highscore: 0,
                    pass: 75
                },
                4: {
                    format: "2|3|4",
                    info: "10 digits in 3 words",
                    highscore: 0,
                    pass: 75
                },
                5: {
                    format: "4|4|4|4|4",
                    info: "20 digits in 5 words",
                    highscore: 0,
                    pass: 75
                }
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
        for (var stage in a) {
            for (var i in a[stage]){
                a[stage][i].state = function(){
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
    }
})();