import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _console, _3dCode } from "../system/console";
import { literal } from "../abstract/literal";
import { instruction } from "../abstract/instruction";
import { _return } from "./_return";
import { _case, _case_type } from "./_case";
import { _break } from "./_break";

export class _switch extends instruction {

    public translate(environment: environment): type {
        this.switch_value.translate(environment);
        _3dCode.switchEvaluation = _3dCode.actualTemp;
        _3dCode.actualTag++;
        let salida = _3dCode.actualTag;
        _3dCode.breakTag = salida;
        for (const case_instr of this.case_list) {
            case_instr.translate(environment);
        }
        _3dCode.output += "L" + salida + ":\n";
        return type.NULL
    }

    constructor(public switch_value: expression | literal, public case_list: Array<_case>, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        const switch_value_data = this.switch_value.execute(environment);
        // comprobar tipos de los case
        for (const case_instr of this.case_list) {
            if (case_instr.type == _case_type.CASE) {
                let case_value_data: any = case_instr.get_value()
                if (case_value_data != null) {
                    if (case_value_data.type != switch_value_data.type) {
                        error_arr.push(new error(case_instr.line, case_instr.column, error_type.SEMANTICO, 'El case tiene tipo distinto al switch'));
                    }
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
                let case_value_data: any = case_instr.get_value()
                if (case_value_data != null) {
                    case_value_data = case_value_data.execute(environment)
                    if (case_value_data.value == switch_value_data.value) {
                        return case_instr.execute(environment)
                    }
                }
            }
        }
        return default_case ? default_case.execute(environment) : { value: null, type: type.NULL }
    }

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Switch\"];";
        const this_count = count
        const child_list = [this.switch_value]
        for (const instr of child_list) {
            try {
                result += "node" + this_count + " -> " + "node" + count + "1;";
                result += instr.plot(Number(count + "1"))
                count++
            } catch (error) {
                console.log(error);
            }
        }
        for (const instr of this.case_list) {
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