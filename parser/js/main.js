import { parser } from "./grammar/main.js";
import { environment } from "./system/environment.js";
export function exec(input) {
    let output = "Hello World";
    const ast = parser.parse(input);
    const main_environment = new environment(null);
    for (const instr of ast) {
        try {
            instr.execute(main_environment);
        } catch (error) {
            console.log(error);
        }
    }
    return output;
}