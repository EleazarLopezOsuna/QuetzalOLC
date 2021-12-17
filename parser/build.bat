cd js/grammar/
jison main_grammar.jison
cd ../..
tsc
browserify js/plot.js -o plot.js
