/*

    Pull in a dictionary or use a webservice to generate a word
    for a number in the MajMonic system.

*/


var WordGenerator = new (function() {
    // this.serviceUrl = "http://majorsystem.com/generator"; // NEED TO ADD FALLBACK TO THIS
    this.dictUrl = "./dictionary/major_dictionary.txt";
    this.dictUuid = "MajorTrainingDictionary-60b02baf-b5cf-4851-ad39-1644bd5dd5ec";
    this.dictionaryError = false;
    this.dictionaryLoaded = false;

    this.requestDictionary = function() {
        var localStorage_db = window.localStorage.getItem(this.dictUuid);

        try {
            if (localStorage_db) {
                this.onDictionaryGet(JSON.parse(localStorage_db), "Loaded from localstorage! B)");
            } else if (this.isOffline()) {
                this.requestLocalFile();
            } else {
                this.promptForDictionary();
            }
        } catch(e) {
            this.clearDictionaryFromLocalStorage();
        }
    }

    this.clearDictionaryFromLocalStorage = function(){
        window.localStorage.removeItem(this.dictUuid);
    }

    this.promptForDictionary = function(){
        this.getfileSize(this.dictUrl, function(size){
            if (size) {
                display.modify.inputPrompt_dictButton("Download (" + (size/1000000).toFixed(2) + " MB" + ")");
            }
        })
        elements.list.input.prompt_dict.button.addEventListener('click', function(){
            try {
                WordGenerator.ajaxMakeRequest(WordGenerator.dictUrl, WordGenerator.onDictionaryGet, WordGenerator.onDictionaryError)
                elements.list.input.prompt_dict.button.style.display = "none";
                display.modify.inputPrompt_dictMessage("<b>Loading</b> <span class='spinner'></span> (Expect freezing for about 30sec)")
            } catch(e) {
                console.log(e);
            }
        })
    }

    this.getfileSize = function(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('HEAD', url);
        xhr.addEventListener('readystatechange', function(){
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) {
                    callback(xhr.getResponseHeader("Content-Length"));
                } else {
                    return false;
                }
            }
        });
        xhr.send();
    }

    this.ajaxMakeRequest = function(url, success, failure) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        if (xhr.readyState === 4 && xhr.response === ""){
            failure.call(xhr.superclass, "AJAX request could not be made (probably because offline?)");
            return false;
        }

        var superclass = this;
        xhr.addEventListener('readystatechange', function(){
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) {
                    return success.call(superclass, superclass.dictionaryToDatabase(this.response), "Had to get it from server :/") || true;
                } else {
                    return failure.call(superclass, this) || false;
                }
            }
        });
        xhr.send();
    }

    this.requestLocalFile = function() {
        elements.list.input.local_dict.filechooser.style.display = "block";
        elements.list.input.local_dict.messages.style.display = "block";
        elements.list.input.local_dict.filechooser.superclass = this; // HACK for Context
        elements.list.input.local_dict.filechooser.addEventListener('change', this.readLocalFile)
    }

    this.readLocalFile = function(e) {
        if (!e) {return false}
        e.preventDefault();
        e.stopPropagation();

        var file = e.target.files[0] || null
        if (!file) {return false}

        var reader = new FileReader();
        var superclass = this.superclass; // HACK for Context
        reader.onload = function(evt){
            try {
                superclass.onDictionaryGet(superclass.dictionaryToDatabase(reader.result), "Loaded from local file! \\(^.^)/");
                display.modify.inputLocal_dictMessages("Thank you! (^.^)");
                elements.list.input.local_dict.filechooser.style.display = "none";
            } catch(err) {
                superclass.onDictionaryError("Could not parse local file as JSON");
            }
        }
        reader.readAsText(file);
    }

    this.isOffline = function(){
        return (window.location.href.indexOf("file:///") >= 0) || false
    }

    this.onDictionaryGet = function(dict, msg){
        msg = msg || "";
        try {
            this.db = dict;
            if (typeof(this.db) === "object"){
                window.localStorage.setItem(this.dictUuid, JSON.stringify(this.db));
                console.info("Generator dictionary is up and running!", msg)
                this.dictionaryLoaded = true;
                elements.list.input.prompt_dict.button.style.display = "none";
                elements.list.input.prompt_dict.message.style.display = "none";
            } else {
                throw(Error("Generator dictionary not retreived as object"))
            }
        } catch(e) {
            this.onDictionaryError(e);
        }
    }

    this.onDictionaryError = function(msg){
        msg = msg || "";
        this.dictionaryError = true;
        console.warn("WordGenerator: Sorry, the generator is broken :/\n", msg);
        display.modify.inputPrompt_dictMessage("<b>This is embarrassing...</b><br>The dictionary didn't load properly :/. If this happens again, you should definitely <a href='https://github.com/cemrajc/majortraining/issues'>file a bug report</a>.")
    }


    this.dictionaryToDatabase = function(dict){
        var words = dict.split("\n");
        var db = {};
        for (var i in words){
            if (!this.matchesDictionaryFilter(words[i])) { continue; }
            var indices = game.explodePossibleNumToNums(game.possibleNumFromWord(words[i]));
            for (var index in indices) {
                if (!db[indices[index]]) {
                    db[indices[index]] = [];
                }
                db[indices[index]].push(words[i])
            }
        }
        return db;
    }

    this.matchesDictionaryFilter = function(word) {
        return /^[a-z]+$/i.test(word);
    }

    this.getWordFromNum = function(num) {
        if (this.dictionaryLoaded && this.db[num]) {
            var working_set = this.db[num];
            var random_index = Math.round(Math.random() * (working_set.length - 1));
            return titleCase(working_set[random_index]) || "<i>Error occurred :(</i>";
        } else {
            if (this.dictionaryError) {
                return "<i>Sorry, it's broken :(</i>"
            } else if (this.dictionaryLoaded) {
                return "<i>No word found</i>"
            } else {
                return "<i>Waiting for dictionary</i>"
            }
        }
    }
    this.getWord = this.getWordFromNum;


    this.init = function() {
        this.requestDictionary();
    }
})();