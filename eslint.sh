#!/bin/bash

set -e

if [ ! -f vars.sh ]; then
    echo "Not found 'vars.sh' file!"
    exit 1
fi

source vars.sh

${PATH_ESLINT} --color ${ESLINT_SRC}
