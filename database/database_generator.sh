echo "  ======== GENERATING DATABASE FROM FILE ========"
echo "  File: " $1

awk -f './txt_to_json.awk' $1 > "$(basename $1).json"
