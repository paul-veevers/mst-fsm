#!/usr/bin/env bash
set -e

rm -rf dev
mkdir dev

cp ./examples/src/index.html ./dev/index.html

rollup -c -w & cd examples && rollup -c -w & cd dev && python -m SimpleHTTPServer 8000
