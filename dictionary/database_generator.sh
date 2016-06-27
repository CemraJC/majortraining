cd $(dirname $0)

if [[ ! -e $1 ]]; then
    echo "Input file doesn't exist? $(pwd -W)/$1"
    exit
fi

echo "  ======== GENERATING DATABASE FROM FILE ========"
echo "  File: " $1

file=$(basename $1)

time awk -f './txt_to_json.awk' $1 > "${file%%.*}.json"
