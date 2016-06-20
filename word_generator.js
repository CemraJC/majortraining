/*

    Pull in a database or use a webservice to generate a word
    for a number in the MajMonic system.

*/


var WordGenerator = new (function() {
    // this.serviceUrl = "http://majorsystem.com/genertor"; // NEED TO ADD FALLBACK TO THIS
    this.dbUrl = "./database/word_generator_db.json";

    this.httpRequest = new XMLHttpRequest();
    this.httpHandler = function() {
        if (!WordGenerator) { return false; }
        if (WordGenerator.httpRequest.readyState === XMLHttpRequest.DONE) {
            if (WordGenerator.httpRequest.status === 200) {
                var db = JSON.parse(WordGenerator.httpRequest.response);
                if (db) {
                    WordGenerator.database = db;
                    return true;
                }
            }
            console.warn("Sorry, the generator is broken...");
        }
    }

    this.getWordFromNum = function(num) {
        if (this.database[num]) {
            var working_set = this.database[num];
            var random_index = Math.round(Math.random() * (working_set.length - 1));
            return working_set[random_index] || "<i>Error occurred :(</i>";
        } else {
            return "<i>No word found</i>"
        }
    }
    this.getWord = this.getWordFromNum;


    this.init = function() {
        this.httpRequest.addEventListener('readystatechange', this.httpHandler);
        this.httpRequest.open('GET', this.dbUrl);
        this.httpRequest.send();
    }
    this.init();

})();