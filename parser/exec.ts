const parser = require("./grammar/main_grammar")
import { environment } from "./system/environment";
import { _console, _3dCode } from "./system/console"
import { error_arr } from "./system/error";

(<any>window).exec = function (input: string): string {
    _console.clean();
    try {
        const ast = parser.parse(input);
        const main_environment = new environment(null);
        console.log("ast", ast)
        for (const instr of ast) {
            try {
                instr.execute(main_environment)
            } catch (error) {
                console.log(error);
            }
        }
        (<any>window).symbol_table = main_environment.get_html()
    } catch (error) {
        console.log(error);
    }


    if (error_arr.length > 0) {
        console.log(error_arr)
        return "$error$"
    }
    return _console.output
}

