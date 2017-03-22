#!/bin/bash

set -e

if [ ! -f .jwtsign ]; then
    echo "Not found '.jwtsign' file!"
    echo "Go to https://addons.mozilla.org/en-US/developers/addon/api/key/ and save your private keys to '.jwtsign' file!"
    exit 1
fi

source .jwtsign

BUILD_DIR="build"
SRC_DIR="${BUILD_DIR}/source"

if [ ! -d ${SRC_DIR} ]; then
    $(which npm) run compile
fi

$(which web-ext) sign --api-key ${APIKEY} --api-secret ${SECRETKEY} --source-dir=${SRC_DIR} --artifacts-dir=${BUILD_DIR}
