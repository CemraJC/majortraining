document.addEventListener("DOMContentLoaded", function(){

    // Initialization block
    loadSettings();
    applySettings();


    // Buttons logic
    var theme_button = document.querySelector('.menucolumn .settings input[name=theme]');
    var reset_button = document.querySelector('.menucolumn .settings input[name=reset]');

    theme_button.addEventListener('click', function(){
        toggleTheme();
        saveSettings();
    });

    reset_button.addEventListener('click', function(event){
        if (event.detail == 2) {
            clearSettings();
        }
    });

    // Level select logic
    var level_list = document.querySelector('.select ul');

    level_list.addEventListener('click', function(event){
        var clicked, found;
        var selected_level = settings.current_level || document.querySelector('.select ul li[selected]');
        event.preventDefault();

        for (var i = 0; i < event.path.length - 1; i++) {
            if (event.path[i].nodeName === "LI") {
                found = true;
                clicked = event.path[i];
                break;
            }
        };
        if(!found) { return }

        if (clicked == selected_level) {
            return;
        }

        clicked.setAttribute('selected', '');
        selected_level.removeAttribute('selected');
        settings.current_level = clicked;
    })

    // Game logic (playing, indicating and score)

        // Need to implement a separate script here.

    // Memory logic


    // Display logic
    var generated_box = document.querySelector('p.generated');
    var readout = {
        score: document.querySelector('.readout .score'),
        highscore: document.querySelector('.readout .highscore'),
        level: document.querySelector('.readout .level'),
        level_info: document.querySelector('.readout .levelinfo')
    }


    display(generated_box, "Display");
    display(readout.score,  0);
    display(readout.highscore,  0);
    display(readout.level, "Level " + 1);
    display(readout.level_info, "Germany");

});

/*

    Generator and Checker functions

 */


function generateNumFromFormat(format) {
    var groups = format.split('|');
    var result = [];
    for (var i = 0; i < groups.length; i++) {
        var digit_range = groups[i].split('-');
        result[i] = generateDigitGroup(digit_range);
    };
    return result.join(' ');
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




/*

    UTILITY FUNCTIONS

*/

function display(element, content) {
    element.innerHTML = content;
}

function toggleTheme() {
    var body = document.body;
    if (body.getAttribute('dark') == 'true') {
        body.removeAttribute('dark');
        settings.dark_theme_active = false;
    } else {
        body.setAttribute('dark', true);
        settings.dark_theme_active = true;
    }
}

function applySettings() {
    settings.dark_theme_active ? toggleTheme() : false;
}

function clearSettings() {
    window.localStorage.removeItem(app_id + "settings");
}

function saveSettings() {
    setLocalStore("settings", JSON.stringify(settings));
}

function loadSettings() {
    var read_buffer = getLocalStore("settings");
    try {
        temp = JSON.parse(read_buffer);
        if (temp === null) { return; }
        settings = temp;
    } catch(e) {
        console.error("Settings corruption detected!!!", e)
        console.log("Sorry, we have to clear your settings... :c")
        clearSettings();
    }
}

function setLocalStore(key, value){
    window.localStorage.setItem(app_id + key, value);
}

function getLocalStore(key){
    return window.localStorage.getItem(app_id + key);
}