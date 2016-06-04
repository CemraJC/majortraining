
var app_id = "major_training_12138772344";

// These are defaults.
var settings = {
    dark_theme_active : false,
    current_level : null,
    level_scores : [ ]
};

var app_data = {
        // Note that 'h' is only valid because it is a part of ch, sh and th
    valid_letters : ['b', 'c', 'd', 'f', 'g', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'z', 'h'],

    // Forward and reverse lookup tables
    num_to_letter : [
        // 0
        ['s', 'c', 'z'],
        // 1
        ['d', 't', 'th'],
        // 2
        ['n'],
        // 3
        ['m'],
        // 4
        ['r'],
        // 5
        ['l'],
        // 6 - Soft
        ['ch', 'sh', 'j', 'g'],
        // 7 - Hard
        ['c', 'g', 'ch', 'k', 'ng'],
        // 8
        ['f', 'v'],
        // 9
        ['b', 'p']
    ]
};
