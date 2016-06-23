
var ms_array = {
    0: ['s', 'c', 'z', 'x'],
    1: ['d', 't', 'th'],
    2: ['n'],
    3: ['m'],
    4: ['r'],
    5: ['l'],
    6: ['ch', 'sh', 'j', 'g'],
    7: ['c', 'g', 'ch', 'q', 'k', 'ng', 'ck'],
    8: ['f', 'ph', 'v'],
    9: ['b', 'p'],
    valid: ['s', 'c', 'z', 'x', 'q', 'd', 't', 'th', 'n', 'm', 'r', 'l', 'ch', 'ck', 'sh', 'ph', 'j', 'g', 'k', 'ng', 'f', 'v', 'b', 'p'],
    multi: ['ch', 'ck', 'sh', 'th', 'ng', 'ph']
}

function reload() {
    window.location.reload();
}

function removeSuccessiveDuplicates(array){
    var result = []
    for (var i = 0; i < array.length; i++) {
        if(array[i-1] != array[i]){
            result.push(array[i]);
        }
    };
    return result
}

function timestamp(){
    return Math.floor(Date.now() / 1)
}

// Shim for unsupporting browsers
if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}

function titleCase(string){
    if (!string) { return ""; }
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
}