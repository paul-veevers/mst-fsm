#!/usr/bin/env bash
set -e

npm run build

prettier --write --single-quote 'examples/src/**/*.js'
eslint 'examples/src/**/*.js'
cd examples
jest