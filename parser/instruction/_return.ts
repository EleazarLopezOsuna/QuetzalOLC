import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _console, _3dCode } from "../system/console";
import { literal } from "../abstract/literal";
import { instruction } from "../abstract/instruction";

export class _return extends instruction {

    public translate(environment: environment): type {
        let returnType = this.return_value.translate(environment);
        _3dCode.output += "goto L" + _3dCode.breakTag + ";\n";
        return returnType;
    }

    constructor(public return_value: instruction | expression, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        return this.return_value.execute(environment);
    }

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Return\"];";
        const this_count = count

        const child_list = [this.return_value]
        for (const instr of child_list) {
            try {
                result += "node" + this_count + " -> " + "node" + count + "1;";
                result += instr.plot(Number(count + "1"))
                count++
            } catch (error) {
                console.log(error);
            }
        }
        return result
    }
}