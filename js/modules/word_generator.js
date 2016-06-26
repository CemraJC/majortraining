/*

    Pull in a database or use a webservice to generate a word
    for a number in the MajMonic system.

*/


var WordGenerator = new (function() {
    // this.serviceUrl = "http://majorsystem.com/generator"; // NEED TO ADD FALLBACK TO THIS
    this.dbUrl = "./database/major_database.json";
    this.dbUuid = "MajorTrainingDatabase-60b02baf-b5cf-4851-ad39-1644bd5dd5ec";
    this.databaseError = false;
    this.databaseLoaded = false;

    this.requestDatabase = function() {
        var localStorage_db = window.localStorage.getItem(this.dbUuid);

        try {
            if (localStorage_db) {
                this.onDatabaseGet(JSON.parse(localStorage_db), "Loaded from localstorage! B)");
            } else if (this.isOffline()) {
                this.requestLocalFile();
            } else {
                this.promptForDatabase();
            }
        } catch(e) {
            this.clearDatabaseFromLocalStorage();
        }
    }

    this.clearDatabaseFromLocalStorage = function(){
        window.localStorage.removeItem(this.dbUuid);
    }

    this.promptForDatabase = function(){
        this.getfileSize(this.dbUrl, function(size){
                if (size) {
                    display.modify.inputPromptdbButton("Download (" + (size/1000000).toFixed(2) + " MB" + ")");
                }
        })
        elements.list.input.promptdb.button.addEventListener('click', function(){
            try {
                WordGenerator.ajaxMakeRequest(WordGenerator.dbUrl, WordGenerator.onDatabaseGet, WordGenerator.onDatabaseError)
                elements.list.input.promptdb.button.style.display = "none";
                display.modify.inputPromptdbMessage("<b>Loading...</b>")
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
                    return success.call(superclass, JSON.parse(this.response), "Had to get it from server :/") || true;
                } else {
                    return failure.call(superclass, this) || false;
                }
            }
        });
        xhr.send();
    }

    this.requestLocalFile = function() {
        elements.list.input.localdb.filechooser.style.display = "block";
        elements.list.input.localdb.messages.style.display = "block";
        elements.list.input.localdb.filechooser.superclass = this; // HACK for Context
        elements.list.input.localdb.filechooser.addEventListener('change', this.readLocalFile)
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
                var db = JSON.parse(reader.result);
                superclass.onDatabaseGet(db, "Loaded from local file! \\(^.^)/");
                display.modify.inputLocaldbMessages("Thank you! (^.^)");
                elements.list.input.localdb.filechooser.style.display = "none";
            } catch(err) {
                superclass.onDatabaseError("Could not parse local file as JSON");
            }
        }
        reader.readAsText(file);
    }

    this.isOffline = function(){
        return (window.location.href.indexOf("file:///") >= 0) || false
    }

    this.onDatabaseGet = function(db, msg){
        msg = msg || "";
        try {
            this.db = db;
            if (typeof(this.db) === "object"){
                window.localStorage.setItem(this.dbUuid, JSON.stringify(this.db));
                console.info("Generator database is up and running!", msg)
                this.databaseLoaded = true;
                elements.list.input.promptdb.button.style.display = "none";
                elements.list.input.promptdb.message.style.display = "none";
            } else {
                throw(Error("Generator database not retreived as object"))
            }
        } catch(e) {
            this.onDatabaseError(e);
        }
    }

    this.onDatabaseError = function(msg){
        msg = msg || "";
        this.databaseError = true;
        display.modify.inputPromptdbMessage("<b>This is embarrassing...</b><br>The database didn't load properly :/. If this happens again, you should definitely <a href='https://github.com/cemrajc/majortraining/issues'>file a bug report</a>.")
        console.warn("WordGenerator: Sorry, the generator is broken :/\n", msg);
    }


    this.getWordFromNum = function(num) {
        if (this.databaseLoaded && this.db[num]) {
            var working_set = this.db[num];
            var random_index = Math.round(Math.random() * (working_set.length - 1));
            return titleCase(working_set[random_index]) || "<i>Error occurred :(</i>";
        } else {
            if (this.databaseError) {
                return "<i>Sorry, it's broken :(</i>"
            } else if (this.databaseLoaded) {
                return "<i>No word found</i>"
            } else {
                return "<i>Waiting for database</i>"
            }
        }
    }
    this.getWord = this.getWordFromNum;


    this.init = function() {
        this.requestDatabase();
    }
})();