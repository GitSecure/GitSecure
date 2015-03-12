#!/bin/bash

find . -type f \( -name '*.js' -o -name '*.html' -o -name '*.css' \) -exec cat {} > concatenatedDirectory.txt \;
