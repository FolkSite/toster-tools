#!/bin/bash

set -e

BUILD_DIR="build"
SRC_DIR="${BUILD_DIR}/source"

function get_version() {
    cat "${SRC_DIR}/manifest.json" | grep -E '"version": "([0-9\.]+)"' | awk '{ print $2 }' | sed -e 's/[",]//g'
}

if [ ! -d ${SRC_DIR} ]; then
    $(which npm) run compile
fi

VERSION=$(get_version)

[ -f "${SRC_DIR}_${VERSION}.zip" ] && rm -f "${SRC_DIR}_${VERSION}.zip"

(cd "${SRC_DIR}" && $(which zip) -r "../source_${VERSION}.zip" .)
