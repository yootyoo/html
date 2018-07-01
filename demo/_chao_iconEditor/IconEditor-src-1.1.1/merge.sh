cd "$(dirname "$0")"

out="lib/icon.js"
cat ./lib/toVector.js > $out
cat ./lib/svg.js >> $out

/Users/paul/Documents/workspace/Tool/node_modules/uglify-js/bin/uglifyjs -o lib/iconmin.js ./lib/icon.js

rm -rf ./lib/icon.js

echo "Done"
