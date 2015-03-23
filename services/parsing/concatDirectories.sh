#!/bin/bash

find . -type f \( -name '*.js' -o -name '*.html' -o -name '*.json' -o -name '*.yml' -o -name '*.ini' -o -name '*.rb' -o -name '*.gitignore' -o -name '*.php' -o -name '*.py' -o -name '*.env' \) -exec cat {} > concatenatedDirectory.txt \;
