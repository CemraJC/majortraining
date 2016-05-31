
var app_id = "major_training_12138772344";

// These are defaults.
var settings = {
    dark_theme_active : false,
    current_level : null,
    level_scores : [ ]
};

var app_consts = {
        // Note that 'h' is only valid because it is a part of ch, sh and th
    valid_letters : ['b', 'c', 'd', 'f', 'g', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'z', 'h'],

    // Forward and reverse lookup tables
    letter_to_num : {
        s  : 0,
        // Uh oh. Need to know if it's a soft or hard C!
        // Soft
        c  : 0,
        z  : 0,
        th : 1,
        t  : 1,
        d  : 1,
        n  : 2,
        m  : 3,
        r  : 4,
        l  : 5,
        // Soft
        ch : 6,
        sh : 6,
        j  : 6,
        // Soft
        g  : 6,
        k  : 7,
        c  : 7,
        ch : 7,
        g  : 7,
        ng : 7,
        f  : 8,
        v  : 8,
        p  : 9,
        b  : 9
    },
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
