#!/bin/bash

set -e

TARGET_DIR="build/source"
SRC_DIR="src"

BABEL_SRC_DIR="${SRC_DIR}/_js"
BABEL_OUT_DIR="${BABEL_SRC_DIR}/babel"

LESS_SRC_DIR="${SRC_DIR}/_less"
LESS_OUT_DIR="${SRC_DIR}/css"

PUG_SRC_DIR="${SRC_DIR}/_pug"
PUG_OUT_DIR="${SRC_DIR}/html"

FILES=("_locales" "css" "html" "icon" "js" "sound" "manifest.json")

function clean_dir() {
    local dir_clean_name="$1"
    [ -d "$dir_clean_name" ] && rm -rf "$dir_clean_name"
    mkdir -p "$dir_clean_name"
}

function build_babel() {
    clean_dir "${BABEL_OUT_DIR}"
    $(which babel) "${BABEL_SRC_DIR}" --out-dir "${BABEL_OUT_DIR}"  --ignore=babel
}

function build_browserify() {
    for cfile in $(find "${BABEL_OUT_DIR}" -type f -name *.js)
    do
        local cfilename="${cfile##*/}"
        $(which browserify) --ignore="${BABEL_OUT_DIR}/_modules/*.js" "${cfile}" -o "${SRC_DIR}/js/${cfilename}"
    done
}

function build_less() {
    clean_dir "${LESS_OUT_DIR}"
    for cfile in $(find "${LESS_SRC_DIR}" -maxdepth 1 -type f -name *.less)
    do
        local newname="$(basename "${cfile##*/}" .less).css"
        $(which lessc) --clean-css="--s1 --advanced" "${cfile}" "${LESS_OUT_DIR}/${newname}"
    done
}

function build_pug() {
    clean_dir "${PUG_OUT_DIR}"
    $(which pug) "${PUG_SRC_DIR}" --pretty --out "${PUG_OUT_DIR}"
}

function compress_uglify() {
    for cfile in $(find "${SRC_DIR}/js" -type f -name *.js)
    do
        $(which uglifyjs) --no-dead-code --compress unused=false --mangle --quotes 1 --output "${cfile}" -- "${cfile}"
    done
}

function remove_js_excludes() {
    for cfile in $(find "${BABEL_OUT_DIR}/_modules" -type f -name *.js)
    do
        local cfilename="${cfile##*/}"
        [ -f "${SRC_DIR}/js/${cfilename}" ] && rm -f "${SRC_DIR}/js/${cfilename}"
    done
}

function remove_pug_excludes() {
    find "${PUG_OUT_DIR}" -maxdepth 1 -type d -name _* -exec rm -rf {} \;
}

function build_copy() {
    clean_dir "${TARGET_DIR}"
    for ((j=0; j < ${#FILES[@]}; j++))
    do
        local file_source="${FILES[$j]}"
        cp -r "${SRC_DIR}/${file_source}" "${TARGET_DIR}"
    done
}



build_babel;
build_browserify;
remove_js_excludes;
compress_uglify;
build_less;
build_pug;
remove_pug_excludes;
build_copy;
