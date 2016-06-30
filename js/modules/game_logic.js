var game = new (function(){

    this.generate = function(){
        var generated = false, limit = 0;
        while ((!generated || generated == save_file.get("last_generated")) && limit < 50) {
            generated = (save_file.get('current_stage') == 2) ? this.generateWord() : this.generateNum();
            limit++
        }
        display.modify.textMain(generated);
        save_file.set('last_generated', generated);
        fontScale.recalculate();
    }

    this.generateWord = function(){
        return this.__generateWordFromFormat(save_file.get('levels')["stage" + save_file.get('current_stage')][save_file.get('current_level')].format);
    }

    this.__generateWordFromFormat = function(format){
        var index,
            random_word_index,
            generated_word,
            words = [],
            i = 0;

        if (!WordGenerator.dictionaryLoaded) {
            return WordGenerator.getWordsFromNum(0);
        }

        // Inefficient
        while (words.length <= 0 && i < 200){
            index = this.__generateNumFromFormat(format).split(' ');
            for (var i = 0; i < index.length; i++) {
                var generated_word = WordGenerator.getWordsFromNum(index[i]);
                if (!generated_word) {
                    words = [];
                    break;
                }
                random_word_index = Math.round(Math.random() * (generated_word.length - 1));
                generated_word = generated_word[random_word_index];
                words.push(titleCase(generated_word));
            };
            i++
        }
        return words.join(' ');
    }

    this.checkWord = function(words, nums) {
        nums = removeEmpty(nums.split(' '));
        words = removeEmpty(words.split(' '));

        for (var i in words) {
            var valid = false;
            if(!nums[i] || !words[i]) { return false }
            check_nums = this.explodePossibleNumToNums(this.possibleNumFromWord(words[i]));
            for (var n in check_nums) {
                if (check_nums[n] == nums[i]) {
                    valid = true;
                    break;
                }
            }
            if (valid) { continue }
            return false;
        }
        return true;
    }


    this.generateNum = function() {
        return this.__generateNumFromFormat(save_file.get('levels')["stage" + save_file.get('current_stage')][save_file.get('current_level')].format);
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
        num = stripSpaces(num);
        word = stripSpaces(word);
        console.log(num, word)
        return this.__matchPossibleNum(num, this.possibleNumFromWord(word));
    }

    this.possibleNumFromWord = function(word){
        var letters = this.__wordToLetters(word);
        var possible_num = [];
        for (var i = 0; i < letters.length; i++) {
            if ( this.ms.valid.indexOf(letters[i]) < 0 ) { continue; }
            possible_num.push(game.__letterToNums(letters[i]));
        };
        return (possible_num.length > 0) ? possible_num : false;
    }

    this.explodePossibleNumToNums = function(possible_num) {
        if (!possible_num) { return false }
        var explodedNums = [], temp = [], max_index = 0;
        // Finc the longest array
        for (var i = 0; i < possible_num.length; i++) {
            (max_index < possible_num[i].length) ? max_index = possible_num[i].length : false;
        };
        // For every array of nums in possible num, recursively join them together
        explodedNums = this.__recursiveSerialJoinArrays(possible_num);
        return explodedNums[0];
    }

    // Should pass this an ARRAY
    this.__recursiveSerialJoinArrays = function(arrays, lvl) {
        lvl = lvl || 1;
        if (lvl > 15 || !arrays) {return arrays;} // recursion limiter
        var reduced_arrays = arrays.slice(1);
        reduced_arrays[0] = this.__serialJoinArrays(arrays[0], arrays[1]);
        var next_array = this.__recursiveSerialJoinArrays(reduced_arrays, lvl + 1);
        if (next_array[0]) {
            return next_array;
        } else {
            return arrays;
        }
    }

    this.__serialJoinArrays = function(arr1, arr2) {
        if (!arr1 || !arr2) { return false; }
        var result = [];
        for (var a in arr1) {
            for (var b in arr2) {
                result.push(arr1[a].toString() + arr2[b].toString())
            }
        }
        return result;
    }


    this.__wordToLetters = function(word) {
        if (typeof(word) !== "string") {return false}
        var letters = [],
            exploded,
            index;
        exploded = removeSuccessiveDuplicates(word.trim().toLowerCase().split(''));

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
            current_stage: save_file.get('current_stage'),
            levels: save_file.get('levels'),
            times: save_file.get('times')
        };
        var level_i = save_file.get('current_level');
        obj.current_score = this.__calculateScore(obj)
        // Set high score if current is higher
        if (obj.current_score > obj.levels["stage" + obj.current_stage][level_i].highscore){
            obj.levels["stage" + obj.current_stage][level_i].highscore = obj.current_score;
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
        this.generate();
    }
})();