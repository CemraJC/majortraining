var game = new (function(){


    this.generateWord = function(){
        return "bung";
    }

    this.generateNum = function() {
        display.modify.textMain(this.__generateNumFromFormat(save_file.get('levels')[save_file.get('current_level')].format));
    }


    this.__generateNumFromFormat = function(format){
        format = format || "2-12"
        var groups = format.split('|');
        var result = [];

        for (var i = 0; i < groups.length; i++) {
            var digit_range = groups[i].split('-');
            result[i] = this.__generateDigitGroup(digit_range);
        };

        return result.join(' ');
    }
    this.__generateDigitGroup = function(range) {
        var single_digit, result = "";
        if (!range[1]) { range[1] = range[0]; }
        var break_probability = 1 / (range[1] - range[0] + 1);

        for (var i = 1; i <= range[1]; i++) {
            single_digit = Math.round(Math.random()*9);
            result += single_digit;
            if (i >= range[0] && Math.random() <= break_probability) {
                break;
            };
        };

        return result;
    }

    this.checkNum = function(num, word) {
        return this.__matchPossibleNum(num, this.possibleNumFromWord(word));
    }

    this.possibleNumFromWord = function(word){
        var letters = this.__wordToLetters(word);
        var possible_num = [];
        for (var i = 0; i < letters.length; i++) {
            if ( this.ms.valid.indexOf(letters[i]) < 0 ) { continue; }
            possible_num.push(game.__letterToNums(letters[i]));
        };
        return possible_num;
    }

    this.__wordToLetters = function(word) {
        exploded = removeSuccessiveDuplicates(word.trim().toLowerCase().split(''));
        var letters = [],
            index;

        for (var i = 0; i < exploded.length; i++) {
            index = this.ms.multi.indexOf(exploded[i] + exploded[i + 1]);
            if (index >= 0) {
                letters.push(this.ms.multi[index]);
                i++ // Skip the already-processed letter
            } else {
                letters.push(exploded[i])
            }
        };

        return letters
    }
    this.__letterToNums = function(letter) {
        nums = [];
        for (i in this.ms) {
            if (i >= 0 && this.ms[i].indexOf(letter) >= 0) {
                nums.push(i);
            }
        };
        return nums;
    }

    this.__matchPossibleNum = function(num, possible_num){
        exploded_num = num.split('');
        if (exploded_num.length != possible_num.length) {
            return false;
        }
        for (var i = 0; i < exploded_num.length; i++) {
            if (possible_num[i].indexOf(exploded_num[i]) < 0){
                return false
            }
        };
        return true;
    }

    this.addTimestamp = function(){
        save_file.get('times').push(timestamp());
    }

    this.updateScore = function(){
        var obj = {
            current_score: save_file.get('current_score'),
            levels: save_file.get('levels'),
            times: save_file.get('times')
        };
        var level_i = save_file.get('current_level');
        obj.current_score = this.__calculateScore(obj)
        // Set high score if current is higher
        if (obj.current_score > obj.levels[level_i].highscore){
            obj.levels[level_i].highscore = obj.current_score;
        }
        save_file.set(obj);
    }

    this.__calculateScore = function(obj) {
        var MAX_PAST = 4;
        var scaler = display.modify.textMain().length,
            timelen = obj.times.length,
            pastinterval = Math.max(Math.min(MAX_PAST, timelen), 1),
            timediff = (obj.times[timelen-1] - obj.times[timelen-pastinterval]) / 1000,
            wpm = Math.round(Math.min(Math.max((60)/(timediff/pastinterval), 1), 300));

        if (timelen > MAX_PAST){
            obj.times = obj.times.slice(-5);
        }

        if (pastinterval <= 2){
            return 10;
        }
        return Math.max(Math.round(wpm*scaler), 0);
    }

    this.init = function(){
        this.ms = ms_array;
        this.generateNum();
    }
})();