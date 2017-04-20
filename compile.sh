#!/bin/bash

set -e

SCRIPT_NAME=$(basename $0)
ARGS=
FLAG_JS=
FLAG_LESS=
FLAG_PUG=

if [ ! -f vars.sh ]; then
    echo "Not found 'vars.sh' file!"
    exit 1
fi

source vars.sh

function clean_dir() {
    local dir_clean_name="$1"
    [ -d "$dir_clean_name" ] && rm -rf "$dir_clean_name"
    mkdir -p "$dir_clean_name"
}

function build_babel() {
    clean_dir "${BABEL_OUT_DIR}"
    ${PATH_BABEL} "${BABEL_SRC_DIR}" --out-dir "${BABEL_OUT_DIR}"  --ignore=babel
}

function build_browserify() {
    clean_dir "${BROWSERIFY_OUT_DIR}"
    for cfile in $(find "${BROWSERIFY_SRC_DIR}" -type f -name *.js)
    do
        local cfilename="${cfile##*/}"
        ${PATH_BROWSERIFY} --ignore="${BROWSERIFY_SRC_DIR}/_modules/*.js" "${cfile}" -o "${BROWSERIFY_OUT_DIR}/${cfilename}"
    done
}

function compress_uglify() {
    for cfile in $(find "${BROWSERIFY_OUT_DIR}" -type f -name *.js)
    do
        ${PATH_UGLIFY} --no-dead-code --compress unused=false --mangle --quotes 1 --output "${cfile}" -- "${cfile}"
    done
}

function remove_js_excludes() {
    for cfile in $(find "${BABEL_OUT_DIR}/_modules" -type f -name *.js)
    do
        local cfilename="${cfile##*/}"
        [ -f "${SRC_DIR}/js/${cfilename}" ] && rm -f "${SRC_DIR}/js/${cfilename}"
    done
}

function build_less() {
    clean_dir "${LESS_OUT_DIR}"
    for cfile in $(find "${LESS_SRC_DIR}" -maxdepth 1 -type f -name *.less)
    do
        local newname="$(basename "${cfile##*/}" .less).css"
        ${PATH_LESS} --verbose --plugin=${PATH_LESS_PLUGIN_CLEAN}="--s1 --advanced" --plugin=${PATH_LESS_PLUGIN_AUTOPREFIXER}="last 10 versions" "${cfile}" "${LESS_OUT_DIR}/${newname}"
    done
}

function build_pug() {
    clean_dir "${PUG_OUT_DIR}"
    ${PATH_PUG} "${PUG_SRC_DIR}" --pretty --out "${PUG_OUT_DIR}"
}

function remove_pug_excludes() {
    find "${PUG_OUT_DIR}" -maxdepth 1 -type d -name "*_*" -exec rm -rf {} \;
}

function build_copy() {
    clean_dir "${TARGET_DIR}"
    for ((j=0; j < ${#FILES[@]}; j++))
    do
        local file_source="${FILES[$j]}"
        cp -r "${SRC_DIR}/${file_source}" "${TARGET_DIR}"
    done
}

function parse_args(){
    ARGS=$(getopt -o hjlp --long help,js,less,pug -- "$@")
    if [ $? != 0 ] ; then
        echo "Shutdown script ${SCRIPT_NAME}!"
        exit 1
    fi
    eval set -- "$ARGS"
}

function print_help() {
    echo '
Help for '"${SCRIPT_NAME}"'

ARGUMENTS:
    -h[--help]       Display this message and exit
    -j[--js]         Compile *.js files
    -l[--less]       Compile *.less files
    -p[--pug]        Compile *.pug files
    -A[--all]        Compile all *.{js,less,pug} files
'
    exit 0
}

if [ "$#" -eq 0 ]; then
    echo "Requires at least one argument!"
    exit 1
fi

parse_args;

while true; do
    case "$1" in
        -h | --help )       print_help;
                    ;;
        -j | --js )         FLAG_JS=true;
                            shift;
                    ;;
        -l | --less )       FLAG_LESS=true;
                            shift;
                    ;;
        -p | --pug )        FLAG_PUG=true;
                            shift;
                    ;;
        -A | --all )        FLAG_JS=true;
                            FLAG_LESS=true;
                            FLAG_PUG=true;
                            shift;
                    ;;
        -- )                shift;
                            break;
                    ;;
        * )                 break;
                    ;;
    esac
done

if [ ${FLAG_JS} ]; then
    build_babel;
    build_browserify;
    remove_js_excludes;
    compress_uglify;
fi

if [ ${FLAG_LESS} ]; then
    build_less;
fi

if [ ${FLAG_PUG} ]; then
    build_pug;
    remove_pug_excludes;
fi

if [ ${FLAG_JS} ] || [ ${FLAG_LESS} ] || [ ${FLAG_PUG} ]; then
    build_copy;
fi
