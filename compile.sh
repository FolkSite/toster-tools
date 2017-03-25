#!/bin/bash

set -e

TARGET_DIR="build/source"
SRC_DIR="src"

FILES=("icon" "js" "css" "_locales" "resources" "manifest.json" "popup.html")

for cfile in $(find "${SRC_DIR}/_src" -type f -name *.js)
do
    cfilename="${cfile##*/}"
    $(which browserify) "${SRC_DIR}/_src/${cfilename}" -o "${SRC_DIR}/js/${cfilename}"
done

[ -d "${TARGET_DIR}" ] && rm -rf ${TARGET_DIR}

mkdir -p ${TARGET_DIR}

for ((j=0; j < ${#FILES[@]}; j++))
do
    file_source="${FILES[$j]}"
    cp -r ${SRC_DIR}/$file_source ${TARGET_DIR}
done
