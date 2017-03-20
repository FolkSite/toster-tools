#!/bin/bash

set -e

if [ -z "$1" ]; then
    BROWSERS=("chrome" "ff" "opera")
else
    BROWSERS=("$@")
fi


for ((i=0; i < ${#BROWSERS[@]}; i++))
do
    browser="${BROWSERS[$i]}"
    [ ! -d browsers/$browser ] && $(which npm) run compile $browser
    (cd browsers/$browser && $(which zip) -r ../$browser .)
done