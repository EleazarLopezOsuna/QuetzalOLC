import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";

export enum string_binary_type {
    CONCAT,
    REPEAT,
    POSITION,
}

export class string_binary extends expression {
    public translate(environment: environment): type {
        throw new Error("Method not implemented.");
    }

    constructor(public left: expression, public right: expression, public type: string_binary_type, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        const left_data = this.left.execute(environment);
        const right_data = this.right.execute(environment);

        switch (this.type) {
            case string_binary_type.CONCAT:
                if (left_data.type == type.STRING && right_data.type == type.STRING) {
                    return { value: (left_data.value.toString() + right_data.value.toString()), type: type.STRING };
                } else {
                    error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar: ' + left_data.value + ' & ' + right_data.value));
                }
                break;
            case string_binary_type.REPEAT:
                if (left_data.type == type.STRING && right_data.type == type.INTEGER) {
                    let return_value = ""
                    for (let index = 0; index < right_data.value; index++) {
                        return_value += left_data.value
                    }
                    return { value: return_value, type: type.STRING };
                } else {
                    error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar: ' + left_data.value + ' ^ ' + right_data.value));
                }
                break;
            case string_binary_type.POSITION:
                if (left_data.type == type.STRING && right_data.type == type.INTEGER) {
                    let string_value: String = left_data.value.toString();
                    try {
                        return { value: string_value.charAt(right_data.value), type: type.STRING };
                    } catch (err) {
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar: ' + left_data.value + ' caracterOfPosition ' + right_data.value));
                    }
                } else {
                    error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar: ' + left_data.value + ' caracterOfPosition ' + right_data.value));
                }
                break;
        }
        // Default
        return { value: null, type: type.NULL }
    }

    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }
}