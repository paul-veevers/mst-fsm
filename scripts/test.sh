#!/usr/bin/env bash
set -e

prettier --write --single-quote 'lib/**/*.js' '*.js'
eslint 'lib/**/*.js'
jest