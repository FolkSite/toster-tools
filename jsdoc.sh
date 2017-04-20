#!/bin/bash

set -e

if [ ! -f vars.sh ]; then
    echo "Not found 'vars.sh' file!"
    exit 1
fi

source vars.sh

[ -d ${JSDOC_BUILD_DIR} ] && rm -rf ${JSDOC_BUILD_DIR}
mkdir -p ${JSDOC_BUILD_DIR}

version=$(get_version)

function sedreplace() {
    local targetfile="$1"
    sed -e "s/{{TITLE}}/${EXT_TITLE}/g" -e "s/{{VERSION}}/${version}/g" -e "s/{{EXT_REPO}}/${EXT_REPO}/g" "${targetfile}" > "${targetfile}.tmp" && mv "${targetfile}.tmp" "${targetfile}"
}

${PATH_JSDOC} --configure jsdoc.json ${JSDOC_SRC_DIR}

find "${JSDOC_BUILD_DIR}" -type f -name '*.html' -print0 | while IFS= read -r -d '' htmlfile; do
    sedreplace "${htmlfile}"
done
