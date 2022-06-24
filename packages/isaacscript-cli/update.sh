#!/bin/bash

set -e # Exit on any errors

# Get the directory of this script:
# https://stackoverflow.com/questions/59895/getting-the-source-directory-of-a-bash-script-from-within
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd "$DIR"

PACKAGE_JSON="$DIR/package.json"
npx npm-check-updates --upgrade --packageFile "$PACKAGE_JSON" --reject "chalk,update-notifier"

# We don't want to run "yarn install", since that would create a duplicated "node_modules" folder.
