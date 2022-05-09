#!/bin/bash
set -x
set -e

find ./spritesheets -exec rename -f -S ' ' '_' {} +
find ./spritesheets -depth -exec rename -f 's/(.*)\/([^\/]*)/$1\/\L$2/' {} \;
