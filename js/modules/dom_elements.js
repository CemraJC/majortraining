var elements = new (function() {
    this.__s = { // __selectors - not really meant to be used by programmers
        mainsection: ".maincolumn .main",
        tabmenu: {
            container: "#drawer-tabs .tab-container",
            levels: {
                container: "#drawer-tabs .tab-container .tab-panel.levelscolumn#tab-1 ",
                readout: "#drawer-tabs .tab-container .tab-panel.levelscolumn#tab-1 .readout",
                select: "#drawer-tabs .tab-container .tab-panel.levelscolumn#tab-1 .select",
                settings: "#drawer-tabs .tab-container .tab-panel#tab-1 .settings"
            },
            generator: {
                container: "#drawer-tabs .tab-container .tab-panel.generatorscolumn#tab-2 ",
            },
            reference:{
                container: "#drawer-tabs .tab-container .tab-panel.referencecolumn#tab-3 ",
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
            tabs: "#drawer input[type=radio]",
            tab_labels: "#drawer .tab-buttons",
            drawer: "input[type=checkbox]#drawer-toggle",
            local_dict: {
                filechooser: this.__s.tabmenu.generator.container + " input[type=file].submit_dict",
                messages: this.__s.tabmenu.generator.container + " p.submit_dict"
            },
            prompt_dict: {
                button: this.__s.tabmenu.generator.container + " button.prompt_dict",
                message: this.__s.tabmenu.generator.container + " p.prompt_dict"
            }
        },
        reference: this.__s.tabmenu.reference.container + " table tbody",
        generator: {
            container: this.__s.tabmenu.generator.container,
            word: this.__s.tabmenu.generator.container + " .inputs button#generate_word",
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
                var found = document.querySelectorAll(obj[item]);
                if (found.length === 1) {
                    found = found[0];
                }
                obj[item] = found;
            } else if (typeof(obj[item]) == "object") {
                this.init(obj[item], lvl + 1)
            }
        }
    }
})();