/*

    Kick off!
    The order of these matters - some rely on others, so be careful
    Also, try not to make circular dependencies - something has to be defined first.

 */


document.addEventListener("DOMContentLoaded", function(){
    elements.init();
    fontScale.init();
    save_file.init();
    display.init();
    inputs.init();
    WordGenerator.init();
    game.init();
});