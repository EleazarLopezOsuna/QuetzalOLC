import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _console, _3dCode } from "../system/console";
import { literal } from "../abstract/literal";
import { instruction } from "../abstract/instruction";
import { parameter } from "../expression/parameter";
import { _struct } from "../literal/_struct";

export class declaration_struct extends instruction {

    public translate(current_environment: environment): type {
        // Save the variable 
        if (current_environment.get_variable(this.variable_id).type != type.UNDEFINED) {
            error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Variable ya inicializada: ' + this.variable_id));
        } else {
            current_environment.save_variable(
                this.variable_id,
                { value: new _struct(this.value, this.line, this.column),
                type: type.STRUCT },
                _3dCode.absolutePos,
                _3dCode.relativePos,
                this.value.length)
            _3dCode.absolutePos++;
            _3dCode.relativePos++;
            let envi = new environment(current_environment);
            envi.name = this.variable_id;
            let relativePos = _3dCode.relativePos;
            _3dCode.relativePos = 0;
            this.value.forEach(element => {
                envi.save_variable(element.id, {value: null, type: element.native_type}, _3dCode.absolutePos, _3dCode.relativePos, 1);
                _3dCode.absolutePos++;
                _3dCode.relativePos++;
            })
            _3dCode.relativePos = relativePos;
            _3dCode.environmentList.push(envi);
        }

        // Default
        return type.NULL
    }

    constructor(public variable_id: string, public value: Array<parameter>, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {

        // Save the variable 
        if (environment.get_variable(this.variable_id).type != type.UNDEFINED) {
            error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Variable ya inicializada: ' + this.variable_id));
        } else {
            environment.save_variable(this.variable_id, { value: new _struct(this.value, this.line, this.column), type: type.STRUCT }, 0, 0, 0)
        }

        // Default
        return { value: null, type: type.NULL }
    }

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Lista de Declaraciones (" + this.variable_id + ")\"];";
        const this_count = count

        const arr_list = [this.value]
        for (const instr_arr of arr_list) {
            for (const instr of instr_arr) {
                try {
                    result += "node" + this_count + " -> " + "node" + count + "1;";
                    result += instr.plot(Number(count + "1"))
                    count++
                } catch (error) {
                    console.log(error);
                }
            }
        }
        return result
    }
}