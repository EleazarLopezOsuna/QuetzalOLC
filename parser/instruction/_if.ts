import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _console } from "../system/console";
import { literal } from "../abstract/literal";
import { instruction } from "../abstract/instruction";

export class _if extends instruction {

    public translate(environment: environment): type {
        throw new Error("Method not implemented.");
    }

    constructor(public condition: expression | literal, public code: instruction, public else_statement: instruction, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        const condition = this.condition.execute(environment);
        if (condition.type != type.BOOLEAN) {
            error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'La condicion del if tiene que ser booleana'));
        }
        if (condition.value == true) {
            return this.code.execute(environment);
        }
        else {
            return this.else_statement?.execute(environment);
        }
    }

    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }
}