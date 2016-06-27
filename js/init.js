/*

    Kick off!
    The order of these matters - some rely on others, so be careful
    Also, try not to make circular depenndencies - something has to be defined first.

 */

document.addEventListener("DOMContentLoaded", function(){
    elements.init();
    save_file.init();
    display.init();
    inputs.init();
    game.init();
    fontScale.init();
    WordGenerator.init();
});