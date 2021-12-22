"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser = require("./grammar/main_grammar");
const environment_1 = require("./system/environment");
const console_1 = require("./system/console");
const error_1 = require("./system/error");
window.plot = function (input) {
    console_1._console.clean();
    try {
        const ast = parser.parse(input);
        const main_environment = new environment_1.environment(null);
        console.log("ast", ast);
        let count = 1;
        let dot_string = "digraph G { node" + count + "[label=\"AST\"];";
        for (const instr of ast) {
            try {
                dot_string += "node1 -> " + "node" + count + "1;";
                dot_string += instr.plot(Number(count + "1"));
                count++;
            }
            catch (error) {
                console.log(error);
            }
        }
        return dot_string + "}";
    }
    catch (error) {
        console.log(error);
    }
    if (error_1.error_arr.length > 0) {
        console.log(error_1.error_arr);
        return "$error$";
    }
    return console_1._console.output;
};
//# sourceMappingURL=plot.js.map