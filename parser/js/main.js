"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser = require("./grammar/main_grammar");
const environment_1 = require("./system/environment");
window.exec = function (input) {
    let output = "Hello World ${input}";
    const ast = parser.parse(input);
    const main_environment = new environment_1.environment(null);
    console.log("ast", ast);
    for (const instr of ast) {
        try {
            instr.execute(main_environment);
        }
        catch (error) {
            console.log(error);
        }
    }
    return output;
};
//# sourceMappingURL=main.js.map