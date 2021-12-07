import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";

export enum arithmetic_binary_type {
    PLUS,
    MINUS,
    TIMES,
    DIV,
    POWER,
    MOD
}

export class arithmetic_binary extends expression {

    constructor(public left: expression, public right: expression, public type: arithmetic_binary_type, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        const left_data = this.left.execute(environment);
        const right_data = this.right.execute(environment);
        const dominant_type = this.get_dominant_type(left_data.type, right_data.type);

        switch (this.type) {
            case arithmetic_binary_type.PLUS:
                switch (dominant_type) {
                    case type.STRING:
                        return { value: (left_data.value.toString() + right_data.value.toString()), type: type.STRING };
                    case type.INTEGER:
                        return { value: (left_data.value + right_data.value), type: type.INTEGER };
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar: ' + left_data.type + ' + ' + right_data.type));
                }
                break;
            case arithmetic_binary_type.MINUS:
                switch (dominant_type) {
                     case type.INTEGER:
                        return { value: (left_data.value - right_data.value), type: type.INTEGER };
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar: ' + left_data.type + ' - ' + right_data.type));
                }
                break;
            case arithmetic_binary_type.TIMES:
                switch (dominant_type) {
                    case type.INTEGER:
                        return { value: (left_data.value * right_data.value), type: type.INTEGER };
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar: ' + left_data.type + ' * ' + right_data.type));
                }
                break;
            case arithmetic_binary_type.POWER:
                switch (dominant_type) {
                    case type.INTEGER:
                        return { value: (Math.pow(left_data.value, right_data.value)), type: type.INTEGER };
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar: ' + left_data.type + ' ** ' + right_data.type));
                }
                break;
            case arithmetic_binary_type.MOD:
                switch (dominant_type) {
                    case type.INTEGER:
                        return { value: (left_data.value % right_data.value), type: type.INTEGER };
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar: ' + left_data.type + ' % ' + right_data.type));
                }
                break;
            case arithmetic_binary_type.DIV:
                switch (dominant_type) {
                    case type.INTEGER:
                        if (right_data.value == 0) {
                            error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, "No se puede dividir entre 0"));
                            break;
                        }
                        else return { value: (left_data.value / right_data.value), type: type.INTEGER };
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar: ' + left_data.type + ' / ' + right_data.type));
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