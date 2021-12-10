import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { data, type } from "../system/type";
import { _console } from "../system/console";
import { literal } from "../abstract/literal";
import { instruction } from "../abstract/instruction";
import { _return } from "./_return";
import { _break } from "./_break";

export enum _case_type {
    CASE, 
    DEFAULT
}

export class _case extends instruction {

    public translate(environment: environment): type {
        throw new Error("Method not implemented.");
    }

    constructor(public case_value: expression | literal, public code: Array<instruction>,public type: _case_type, line: number, column: number) {
        super(line, column);
    }

    public get_value(): expression | literal {
        return this.case_value
    }

    public execute(environment: environment): data {
        for (const instr of this.code) {
            const instr_data = instr.execute(environment)
            if (instr_data instanceof _break) {
                break;
            } else if (instr_data instanceof _return) {
                return instr_data
            }
        }
        return { value: null, type: type.NULL }
    }

    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }
}