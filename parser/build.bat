cd js/grammar/
jison main_grammar.jison
cd ../..
tsc
browserify js/main.js -o bundle.js