import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _console } from "../system/console";
import { literal } from "../abstract/literal";
import { instruction } from "../abstract/instruction";
import { _return } from "./_return";
import { _case, _case_type } from "./_case";
import { _break } from "./_break";
import { _continue } from "./_continue";
import { unary_instruction } from "./unary_instruction";
import { assignation_unary } from "./assignation_unary";
import { declaration_item } from "./declaration_item";
import { declaration_list } from "./declaration_list";

export class _for extends instruction {

    public translate(environment: environment): type {
        throw new Error("Method not implemented.");
    }

    constructor(public initialization: instruction, public condition: expression, public unary: unary_instruction, public code: Array<instruction>, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        if (this.initialization instanceof assignation_unary
            || this.initialization instanceof declaration_list) {
            this.initialization.execute(environment);
        } else {
            error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'La inicializacion del for tiene que ser una declaracion o asignacion'));
            // Default
            return { value: null, type: type.NULL }
        }
        let condition_data = this.condition.execute(environment);
        if (condition_data.type != type.BOOLEAN) {
            error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'La condicion tiene que ser de tipo booleana'));
            // Default
            return { value: null, type: type.NULL }
        }
        while (condition_data.value == true) {
            for (const instruction of this.code) {
                let instruction_data = instruction.execute(environment)
                if (instruction instanceof _return) {
                    return instruction_data
                } else if (instruction instanceof _break) {
                    break
                } else if (instruction instanceof _continue) {
                    continue
                }
            }
            this.unary.execute(environment)
            condition_data = this.condition.execute(environment);
            if (condition_data.type != type.BOOLEAN) {
                error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'La condicion tiene que ser de tipo booleana'));
                // Default
                return { value: null, type: type.NULL }
            }
        }
        // Default
        return { value: null, type: type.NULL }
    }

    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }
}