#!/bin/bash
echo "call it with source or . if you want to have pebble alias created"
rm -rf ./dist
wget -q https://github.com/pebble/pebblejs/archive/master.zip -O /tmp/pebblejs-master.zip
unzip  -o -q /tmp/pebblejs-master.zip -d ./dist
cp ./appinfo.json ./dist/pebblejs-master/
cp -r ./src/* ./dist/pebblejs-master/src/js/
(cd ./resources/images; ./make_graphics.sh)
cp -r ./resources/images/out/* ./dist/pebblejs-master/resources/images/
alias pebble='function _pebble_alias(){ (cd ./dist/pebblejs-master/; pebble $@;) };_pebble_alias'
