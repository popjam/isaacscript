#!/bin/bash

set -e # Exit on any errors

# Get the directory of this script:
# https://stackoverflow.com/questions/59895/getting-the-source-directory-of-a-bash-script-from-within
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd "$DIR"

RULE_NAME="strict-enums"
TEST_NAME="Comparing a number literal to a type that contains a number literal"

echo "Running test: $RULE_NAME --> $TEST_NAME"
npx jest "$DIR/tests/rules/$RULE_NAME"*".test.ts" --verbose=false -t "$TEST_NAME"
