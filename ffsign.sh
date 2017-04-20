#!/bin/bash

set -e

if [ ! -f vars.sh ]; then
    echo "Not found 'vars.sh' file!"
    exit 1
fi

source vars.sh

if [ ! -f .jwtsign ]; then
    echo "Not found '.jwtsign' file!"
    echo "Go to https://addons.mozilla.org/en-US/developers/addon/api/key/ and save your private keys to '.jwtsign' file!"
    exit 1
fi

source .jwtsign

if [ ! -d ${TARGET_DIR} ]; then
    $(which npm) run compile
fi

${PATH_WEBEXT} sign --api-key ${APIKEY} --api-secret ${SECRETKEY} --source-dir=${TARGET_DIR} --artifacts-dir=${BUILD_DIR}
