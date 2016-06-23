var elements = new (function() {
    this.__s = { // __selectors - not really meant to be used by programmers
        mainsection: ".maincolumn .main",
        menusection: ".menucolumn",
        assistsection: ".assistantcolumn",
        readout: ".menucolumn .readout",
        select: ".menucolumn .select",
        settings: ".menucolumn .settings"
    }

    this.list = {
        text: {
            main: this.__s.mainsection + " p.generated",
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
        button: {
            skip: this.__s.mainsection + " .numbar a.skip",
            theme: this.__s.settings + " input[name=theme]",
            reset: this.__s.settings + " input[name=reset]"
        },
        input: {
            main: this.__s.mainsection + " input[name=main_input]",
            localdb: {
                filechooser: this.__s.assistsection + " input[type=file].submit_db",
                messages: this.__s.assistsection + " p.submit_db"
            }
        },
        assistant: {
            container: this.__s.assistsection,
            reference: this.__s.assistsection + " table tbody",
            generator: {
                word: this.__s.assistsection + " .inputs button",
                number: this.__s.assistsection + " .inputs input[type=number]",
                output: this.__s.assistsection + " span.generated_word"
            }
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