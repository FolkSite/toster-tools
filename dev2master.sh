#!/bin/bash

set -e

if [ ! -f vars.sh ]; then
    echo "Not found 'vars.sh' file!"
    exit 1
fi

source vars.sh

./jsdoc.sh

unchanges=$(get_git_dirty)

if [ "$unchanges" == "*" ]; then
    git add --all
    git commit -a
fi

if [ "${CURRENT_BRANCH}" != "master" ]; then
    git checkout master
    git merge "${CURRENT_BRANCH}"
    git push origin master
    git branch -d "${CURRENT_BRANCH}"
    git checkout -b "${CURRENT_BRANCH}"
else
    git push origin master
fi
