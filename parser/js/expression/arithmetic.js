import { expression } from "../abstract/expression.js";
import { error, error_arr, error_type } from "../system/error.js";
import { type } from "../system/type.js";
export var arithmetic_type;
(function (arithmetic_type) {
    arithmetic_type[arithmetic_type["PLUS"] = 0] = "PLUS";
    arithmetic_type[arithmetic_type["MINUS"] = 1] = "MINUS";
    arithmetic_type[arithmetic_type["TIMES"] = 2] = "TIMES";
    arithmetic_type[arithmetic_type["DIV"] = 3] = "DIV";
    arithmetic_type[arithmetic_type["POWER"] = 4] = "POWER";
    arithmetic_type[arithmetic_type["MOD"] = 5] = "MOD";
})(arithmetic_type || (arithmetic_type = {}));
export class arithmetic extends expression {
    constructor(left, right, type, line, column) {
        super(line, column);
        this.left = left;
        this.right = right;
        this.type = type;
    }
    execute(environment) {
        const left_data = this.left.execute(environment);
        const right_data = this.right.execute(environment);
        const dominant_type = this.get_dominant_type(left_data.type, right_data.type);
        switch (this.type) {
            case arithmetic_type.PLUS:
                switch (dominant_type) {
                    case type.STRING:
                        return { value: (left_data.value.toString() + right_data.value.toString()), type: type.STRING };
                    case type.INTEGER:
                        return { value: (left_data.value + right_data.value), type: type.INTEGER };
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar: ' + left_data.type + ' + ' + right_data.type));
                }
                break;
            case arithmetic_type.MINUS:
                switch (dominant_type) {
                    case type.INTEGER:
                        return { value: (left_data.value - right_data.value), type: type.INTEGER };
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar: ' + left_data.type + ' - ' + right_data.type));
                }
                break;
            case arithmetic_type.TIMES:
                switch (dominant_type) {
                    case type.INTEGER:
                        return { value: (left_data.value * right_data.value), type: type.INTEGER };
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar: ' + left_data.type + ' * ' + right_data.type));
                }
                break;
            case arithmetic_type.POWER:
                switch (dominant_type) {
                    case type.INTEGER:
                        return { value: (Math.pow(left_data.value, right_data.value)), type: type.INTEGER };
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar: ' + left_data.type + ' ** ' + right_data.type));
                }
                break;
            case arithmetic_type.MOD:
                switch (dominant_type) {
                    case type.INTEGER:
                        return { value: (left_data.value % right_data.value), type: type.INTEGER };
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar: ' + left_data.type + ' % ' + right_data.type));
                }
                break;
            case arithmetic_type.DIV:
                switch (dominant_type) {
                    case type.INTEGER:
                        if (right_data.value == 0) {
                            error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, "No se puede dividir entre 0"));
                            break;
                        }
                        else
                            return { value: (left_data.value / right_data.value), type: type.INTEGER };
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar: ' + left_data.type + ' / ' + right_data.type));
                }
                break;
        }
        // Default
        return { value: null, type: type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
