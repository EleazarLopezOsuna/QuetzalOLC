const parser = require("./grammar/main_grammar")
import { environment } from "./system/environment";
(<any>window).exec = function (input: string): string {
    let output = "Hello World ${input}"
    const ast = parser.parse(input);
    const main_environment = new environment(null);
    console.log("ast", ast)
    for (const instr of ast) {
        try {
            instr.execute(main_environment);
        } catch (error) {
            console.log(error);
        }
    }
    return output
}