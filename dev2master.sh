#!/bin/bash

set -e

CURRENT_BRANCH=$(git branch | grep -E '^\* ([^\s]+)' | cut -d' ' -f2)

function get_git_dirty() {
    [[ $(git diff --shortstat 2> /dev/null | tail -n1) != "" ]] && echo "*"
}

unchanges=$(get_git_dirty)
if [ "$unchanges" == "*" ]; then
    git add --all
    git commit -a
fi

if [ "${CURRENT_BRANCH}" != "master" ]; then
    git checkout master
    git merge "${CURRENT_BRANCH}"
    git push --all origin
    git branch -d "${CURRENT_BRANCH}"
    git checkout -b "${CURRENT_BRANCH}"
else
    git push --all origin
fi
