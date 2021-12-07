const parser = require("./grammar/main_grammar")
import { environment } from "./system/environment";
import { _console } from "./system/console"
(<any>window).exec = function (input: string): string {

    const ast = parser.parse(input);
    const main_environment = new environment(null);
    console.log("ast", ast)
    _console.output = ""
    for (const instr of ast) {
        try {
            _console.output += instr.execute(main_environment).value;
        } catch (error) {
            console.log(error);
        }
    }
    return _console.output
}