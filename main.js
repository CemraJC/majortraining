document.addEventListener("DOMContentLoaded", function(){

    // Initialization block
    loadSettings();
    applySettings();


    // Theme changer logic
    var theme_button = document.querySelector('.menucolumn .settings input[type=button]');

    theme_button.addEventListener('click', function(){
        toggleTheme();
        saveSettings();
    });


});


/*

    UTILITY FUNCTIONS

*/

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