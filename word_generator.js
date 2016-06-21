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

    this.httpRequest = new XMLHttpRequest();
    this.ajaxMakeRequest = function(req, url, success, failure) {
        req.superclass = this;
        req.open('GET', url);
        req.send();
        if (req.readyState === 4 && req.response === ""){
            failure.call(req.superclass, "AJAX Request could not be made (probably because offline?)");
            return false;
        }

        req.addEventListener('readystatechange', function(){
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) {
                    return success.call(this.superclass, JSON.parse(this.response), "Had to get it from server :/") || true;
                } else {
                    return failure.call(this.superclass, this) || false;
                }
            }
        });
    }

    this.requestDatabase = function(){
        var localStorage_db = window.localStorage.getItem(this.dbUuid);
        try {
            if (localStorage_db) {
                this.onDatabaseGet(JSON.parse(localStorage_db), "Loaded from localstorage B)");
            } else {
                this.ajaxMakeRequest(this.httpRequest, this.dbUrl, this.onDatabaseGet, this.onDatabaseError);
            }
        } catch(e) {
            window.localStorage.removeItem(this.dbUuid);
        }
    }

    this.onDatabaseGet = function(db, msg){
        msg = msg || "";
        try {
            this.db = db;
            if (typeof(this.db) === "object"){
                window.localStorage.setItem(this.dbUuid, JSON.stringify(this.db));
                console.info("Generator database is up and running!", msg)
                this.databaseLoaded = true;
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
                return "<i>Still loading database...</i>"
            }
        }
    }
    this.getWord = this.getWordFromNum;


    this.init = function() {
        this.requestDatabase();
    }
    this.init();

})();