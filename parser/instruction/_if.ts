import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _console } from "../system/console";
import { literal } from "../abstract/literal";
import { instruction } from "../abstract/instruction";
import { _return } from "./_return";

export class _if extends instruction {

    public translate(environment: environment): type {
        throw new Error("Method not implemented.");
    }

    constructor(public condition: expression | literal, public code: Array<instruction>, public else_statement: instruction | Array<instruction>, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        const condition = this.condition.execute(environment);
        // first check that the condition is a boolean
        if (condition.type != type.BOOLEAN) {
            error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'La condicion del if tiene que ser booleana'));
        }
        // if the condition is true execute the set of instructions
        if (condition.value == true) {
            for (const instr of this.code) {
                try {
                    const element_data = instr.execute(environment);
                    if (instr instanceof _return) {
                        return element_data;
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
        else {
            // else if is another if
            if(this.else_statement instanceof instruction) {
                return this.else_statement.execute(environment);
            }
            // Else without condition is just a set of instructions 
            else if (this.else_statement instanceof Array) {
                for (const instr of this.else_statement) {
                    try {
                        const element_data = instr.execute(environment);
                        if (instr instanceof _return) {
                            return element_data;
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            } 
        }
        return {value: null, type: type.NULL}
    }

    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }
}