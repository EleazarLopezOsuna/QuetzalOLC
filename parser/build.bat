cd js/grammar/
jison main_grammar.jison
cd ../..
tsc
browserify js/exec.js -o exec.js
browserify js/translate.js -o translate.js
browserify js/plot.js -o plot.js
