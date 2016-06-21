BEGIN {
    print "{"
    FS=" "
}

/^[0-9]+/ {
    for (i = 2; i <= NF; ++i) {
        if (i > 2 || length(num_array[$1]) > 0) {
            comma = ", "
        } else {
            comma = ""
        }
        num_array[$1] = num_array[$1] comma "\"" $i "\""
    }
}

END {
    for (i in num_array) {
        print "    \"" i "\": [" num_array[i] "],"
    }
    print "}"
}