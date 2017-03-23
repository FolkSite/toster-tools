#!/bin/bash

set -e

TARGET_DIR="build/source"
SRC_DIR="src"

FILES=("icon" "js" "css" "_locales" "resources" "manifest.json" "popup.html")

$(which browserify) -t brfs ${SRC_DIR}/resources/content.js -o ${SRC_DIR}/js/content.js
$(which browserify) -t brfs ${SRC_DIR}/resources/popup.js -o ${SRC_DIR}/js/popup.js
$(which browserify) -t brfs ${SRC_DIR}/resources/background.js -o ${SRC_DIR}/js/background.js

[ -d "${TARGET_DIR}" ] && rm -rf ${TARGET_DIR}
[ -f "${TARGET_DIR}.zip" ] && rm -f ${TARGET_DIR}.zip

mkdir -p ${TARGET_DIR}

for ((j=0; j < ${#FILES[@]}; j++))
do
    file_source="${FILES[$j]}"
    cp -r ${SRC_DIR}/$file_source ${TARGET_DIR}
done

[ -f "${TARGET_DIR}/resources/content.js" ] && rm -f ${TARGET_DIR}/resources/content.js
[ -f "${TARGET_DIR}/resources/popup.js" ] && rm -f ${TARGET_DIR}/resources/popup.js
[ -f "${TARGET_DIR}/resources/background.js" ] && rm -f ${TARGET_DIR}/resources/background.js
