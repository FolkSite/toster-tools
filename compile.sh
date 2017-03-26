#!/bin/bash

set -e

TARGET_DIR="build/source"
SRC_DIR="src"

BABEL_SRC_DIR="${SRC_DIR}/_src"
BABEL_OUT_DIR="${BABEL_SRC_DIR}/babel"

FILES=("icon" "js" "css" "fonts" "_locales" "resources" "manifest.json" "popup.html")

function build_babel() {
    [ -d "${BABEL_OUT_DIR}" ] && rm -rf "${BABEL_OUT_DIR}" && mkdir -p "${BABEL_OUT_DIR}"
    $(which babel) "${BABEL_SRC_DIR}" --out-dir "${BABEL_OUT_DIR}"  --ignore=babel
}

function build_browserify() {
    for cfile in $(find "${BABEL_OUT_DIR}" -type f -name *.js)
    do
        cfilename="${cfile##*/}"
        $(which browserify) "${BABEL_OUT_DIR}/${cfilename}" -o "${SRC_DIR}/js/${cfilename}"
    done
}

function build_copy() {
    [ -d "${TARGET_DIR}" ] && rm -rf "${TARGET_DIR}"
    mkdir -p "${TARGET_DIR}"
    for ((j=0; j < ${#FILES[@]}; j++))
    do
        file_source="${FILES[$j]}"
        cp -r "${SRC_DIR}/${file_source}" "${TARGET_DIR}"
    done
}



build_babel;
build_browserify;
build_copy;
