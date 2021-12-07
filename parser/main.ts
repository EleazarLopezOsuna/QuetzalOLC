const parser = require("./grammar/main_grammar")
import { environment } from "./system/environment";
import { _console } from "./system/console"
import { error_arr } from "./system/error";
(<any>window).exec = function (input: string): string {
    try {
        const ast = parser.parse(input);
        const main_environment = new environment(null);
        console.log("ast", ast)
        _console.output = ""
        for (const instr of ast) {
            try {
                _console.output += instr.execute(main_environment).value + "\n";
            } catch (error) {
                console.log(error);
            }
        }
    } catch (error) {
        console.log(error);
    }

    if (error_arr.length > 0) {
        console.log(error_arr)
        return "$error$"
    }
    return _console.output
}