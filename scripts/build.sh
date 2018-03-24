#!/usr/bin/env bash
set -e

rm -rf dist
mkdir dist

rollup -c
babel lib --out-dir dist/node
