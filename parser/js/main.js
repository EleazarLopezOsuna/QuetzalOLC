"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser = require("./grammar/main_grammar");
const environment_1 = require("./system/environment");
const console_1 = require("./system/console");
window.exec = function (input) {
    const ast = parser.parse(input);
    const main_environment = new environment_1.environment(null);
    console.log("ast", ast);
    console_1._console.output = "";
    for (const instr of ast) {
        try {
            console_1._console.output += instr.execute(main_environment).value;
        }
        catch (error) {
            console.log(error);
        }
    }
    return console_1._console.output;
};
//# sourceMappingURL=main.js.map