/*

    Pull in a database or use a webservice to generate a word
    for a number in the MajMonic system.

*/


var WordGenerator = new (function() {
    // this.serviceUrl = "http://majorsystem.com/generator"; // NEED TO ADD FALLBACK TO THIS
    this.dbUrl = "./database/word_generator_db.json";
    this.dbUuid = "MajorTrainingDatabase-60b02baf-b5cf-4851-ad39-1644bd5dd5ec";

    this.httpRequest = new XMLHttpRequest();
    this.ajaxMakeRequest = function(req, url, success, failure) {
        req.open('GET', url);
        req.send();
        req.superclass = this;

        req.addEventListener('readystatechange', function(){
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) {
                    return success.call(this.superclass, JSON.parse(this.response), "Had to get it from server :/") || true;
                } else {
                    return failure(this) || false;
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
                console.info("Generator database is up and running!", msg, this.db)
            } else {
                throw(Error("Generator database not retreived as object"))
            }
        } catch(e) {
            this.onDatabaseError(e);
        }
    }

    this.onDatabaseError = function(msg){
        console.warn("Sorry, the generator is broken :(", msg);
    }


    this.getWordFromNum = function(num) {
        if (this.database && this.database[num]) {
            var working_set = this.database[num];
            var random_index = Math.round(Math.random() * (working_set.length - 1));
            return working_set[random_index] || "<i>Error occurred :(</i>";
        } else {
            return "<i>No word found</i>"
        }
    }
    this.getWord = this.getWordFromNum;


    this.init = function() {
        this.requestDatabase();
    }
    this.init();

})();