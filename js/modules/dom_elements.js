var elements = new (function() {
    this.__s = { // __selectors - not really meant to be used by programmers
        mainsection: ".maincolumn .main",
        tabmenu: {
            container: "#drawer .tab-container",
            levels: {
                container: "#drawer .tab-container .tab-panel#tab-1 .levelscolumn",
                readout: "#drawer .tab-container .tab-panel#tab-1 .levelscolumn .readout",
                select: "#drawer .tab-container .tab-panel#tab-1 .levelscolumn .select",
                settings: "#drawer .tab-container .tab-panel#tab-1 .settings"
            },
            generator: {
                container: "#drawer .tab-container .tab-panel#tab-2 .generatorscolumn",
            },
            reference:{
                container: "#drawer .tab-container .tab-panel#tab-3 .referencecolumn",
            }
        }
    }

    this.list = {
        text: {
            main: this.__s.mainsection + " p.generated",
            readout: {
                container: this.__s.tabmenu.levels.readout,
                score: this.__s.tabmenu.levels.readout + " .score",
                highscore: this.__s.tabmenu.levels.readout + " .highscore",
                level: this.__s.tabmenu.levels.readout + " .level",
                levelinfo: this.__s.tabmenu.levels.readout + " .levelinfo"
            },
            select: this.__s.tabmenu.levels.container + " .select ul",
            count: this.__s.mainsection + " .numbar span.count"
        },
        button: {
            skip: this.__s.mainsection + " .numbar a.skip",
            theme: this.__s.tabmenu.levels.settings + " input[name=theme]",
            reset: this.__s.tabmenu.levels.settings + " input[name=reset]"
        },
        input: {
            main: this.__s.mainsection + " input[name=main_input]",
            drawer: "input[type=checkbox]#drawer-toggle",
            localdb: {
                filechooser: this.__s.tabmenu.generator.container + " input[type=file].submit_db",
                messages: this.__s.tabmenu.generator.container + " p.submit_db"
            }
        },
        reference: this.__s.tabmenu.reference.container + " table tbody",
        generator: {
            container: this.__s.tabmenu.generator.container,
            word: this.__s.tabmenu.generator.container + " .inputs button",
            number: this.__s.tabmenu.generator.container + " .inputs input[type=number]",
            output: this.__s.tabmenu.generator.container + " span.generated_word"
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
})();