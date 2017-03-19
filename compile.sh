#!/bin/bash

set -e

if [ -z "$1" ]; then
    BROWSERS=("chrome" "ff" "opera")
else
    BROWSERS=("$@")
fi

mkdir -p build

$(which browserify) -t brfs src/content.js -o build/content.js

for ((i=0; i < ${#BROWSERS[@]}; i++))
do
    browser="${BROWSERS[$i]}"
    [ -d "browsers/$browser" ] && rm -rf browsers/$browser
    [ -f "browsers/$browser.zip" ] && rm -f browsers/$browser.zip
    mkdir -p browsers/$browser
    cp -r build browsers/$browser
    cp manifest.json browsers/$browser
done