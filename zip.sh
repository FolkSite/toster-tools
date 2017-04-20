#!/bin/bash

set -e

if [ ! -f vars.sh ]; then
    echo "Not found 'vars.sh' file!"
    exit 1
fi

source vars.sh

if [ ! -d "${TARGET_DIR}" ]; then
    $(which npm) run compile
fi

VERSION=$(get_version)

[ -f "${TARGET_DIR}_${VERSION}.zip" ] && rm -f "${TARGET_DIR}_${VERSION}.zip"

[ -f "${TARGET_DIR}/.web-extension-id" ] && rm -f "${TARGET_DIR}/.web-extension-id"

(cd "${TARGET_DIR}" && $(which zip) -r "../source_${VERSION}.zip" .)
