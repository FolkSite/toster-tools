#!/bin/bash

set -e

BUILD_DIR="build"
SRC_DIR="${BUILD_DIR}/source"


if [ ! -d ${SRC_DIR} ]; then
    $(which npm) run compile
fi

[ -f "${SRC_DIR}.zip" ] && rm -f ${SRC_DIR}.zip

(cd "${SRC_DIR}" && $(which zip) -r "../source" .)
