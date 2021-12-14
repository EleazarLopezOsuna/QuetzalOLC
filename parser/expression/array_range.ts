import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _3dCode, _console } from "../system/console";
import { literal } from "../abstract/literal";


export class array_range extends expression {

    public translate(environment: environment): type {
        throw new Error("Method not implemented.");
    }

    constructor(public left: expression | string | literal, public right: expression | string | literal, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        const left_data = (typeof this.left != 'string') ? this.left.execute(environment) : { type: type.STRING, value: this.left };
        const right_data = (typeof this.right != 'string') ? this.right.execute(environment) : { type: type.STRING, value: this.right };
        if (left_data.type != type.INTEGER && left_data.value != 'begin') {
            error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Inicio de rango no valido: ' + left_data.value));
            return { value: null, type: type.NULL }
        }
        if (right_data.type != type.INTEGER && right_data.value != 'end') {
            error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Fin de rango no valido: ' + right_data.value));
            return { value: null, type: type.NULL }
        }
        if(left_data.type == type.INTEGER && right_data.type == type.INTEGER && left_data.value >= right_data.value) {
            error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Inicio del rango tiene que ser mayor que el final'));
            return { value: null, type: type.NULL }
        }
        // Default
        return { value: [left_data.value, right_data.value], type: type.INTEGER }
    }

    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }
}