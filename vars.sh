#!/bin/bash

set -e

EXT_TITLE="Toster Tools"
EXT_REPO="toster-tools"

NM="./node_modules"

BUILD_DIR="build"
TARGET_DIR="${BUILD_DIR}/source"
SRC_DIR="src"


ESLINT_SRC="${SRC_DIR}/_js"

JSDOC_SRC_DIR=${ESLINT_SRC}
JSDOC_BUILD_DIR="docs"

BABEL_SRC_DIR=${ESLINT_SRC}
BABEL_OUT_DIR="${SRC_DIR}/_babel"

BROWSERIFY_SRC_DIR=${BABEL_OUT_DIR}
BROWSERIFY_OUT_DIR="${SRC_DIR}/js"

LESS_SRC_DIR="${SRC_DIR}/_less"
LESS_OUT_DIR="${SRC_DIR}/css"

PUG_SRC_DIR="${SRC_DIR}/_pug"
PUG_OUT_DIR="${SRC_DIR}/html"

FILES=("_locales" "css" "html" "icon" "js" "sound" "manifest.json" "CHANGELOG.md")

CURRENT_BRANCH=$(git branch | grep -E '^\* ([^\s]+)' | cut -d' ' -f2)

PATH_JSDOC="${NM}/.bin/jsdoc"
PATH_BABEL="${NM}/.bin/babel"
PATH_ESLINT="${NM}/.bin/eslint"
PATH_BROWSERIFY="${NM}/.bin/browserify"
PATH_UGLIFY="${NM}/.bin/uglifyjs"
PATH_PUG="${NM}/.bin/pug"
PATH_WEBEXT="${NM}/.bin/web-ext"
PATH_LESS="${NM}/.bin/lessc"

PATH_LESS_PLUGIN_CLEAN="${NM}/less-plugin-clean-css/lib/index.js"
PATH_LESS_PLUGIN_AUTOPREFIXER="${NM}/less-plugin-autoprefix/lib/index.js"

function get_git_dirty() {
    [[ $(git diff --shortstat 2> /dev/null | tail -n1) != "" ]] && echo "*"
}

function get_version() {
    cat "${SRC_DIR}/manifest.json" | grep -E '"version": "([0-9\.]+)"' | awk '{ print $2 }' | sed -e 's/[",]//g'
}

