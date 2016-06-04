/*

    Generator and Checker functions

 */


var Generator = function(state) {
    this.num = function() {
        var format = state.level_format_string;
        var groups = format.split('|');
        var result = [];

        for (var i = 0; i < groups.length; i++) {
            var digit_range = groups[i].split('-');
            result[i] = generateDigitGroup(digit_range);
        };

        return result.join(' ');
    }
}




function generateDigitGroup(range_array) {
    var single_digit, result = "";
    if (!range_array[1]) { range_array[1] = range_array[0]; }
    var break_probability = 1 / (range_array[1] - range_array[0] + 1);

    for (var i = 1; i <= range_array[1]; i++) {
        single_digit = Math.round(Math.random()*9);
        result += single_digit;
        if (i >= range_array[0] && Math.random() <= break_probability) {
            break;
        };
    };

    return result;
}

function generate_word() {
    return "bung"
}

function checkValid(generated, input) {
    if (typeof(generated) == "number") {
        checkValidNumber(generated, input);
    } else {
        checkValidWord(generated, input);
    }
}

function checkValidWord(number, word) {

}