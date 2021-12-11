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

export class _switch extends instruction {

    public translate(environment: environment): type {
        throw new Error("Method not implemented.");
    }

    constructor(public switch_value: expression | literal, public case_list: Array<_case>, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        const switch_value_data = this.switch_value.execute(environment);
        // comprobar tipos de los case
        for (const case_instr of this.case_list) {
            if (case_instr.type == _case_type.CASE) {
                const case_value_data = case_instr.get_value().execute(environment)
                if (case_value_data.type != switch_value_data.type) {
                    error_arr.push(new error(case_instr.line, case_instr.column, error_type.SEMANTICO, 'El case tiene tipo distinto al switch'));
                }
            }
        }

        // ejecutar los case
        let default_case;
        for (const case_instr of this.case_list) {
            // Guardar el default por si ningun case es verdadero
            if (case_instr.type == _case_type.DEFAULT) {
                default_case = case_instr
            } else {
                const case_value_data = case_instr.get_value().execute(environment)
                if (case_value_data.value == switch_value_data.value) {
                    return case_instr.execute(environment)
                }
            }
        }
        return default_case ? default_case.execute(environment) : { value: null, type: type.NULL }
    }

    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }
}