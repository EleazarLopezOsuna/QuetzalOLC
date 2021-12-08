"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arithmetic_binary = exports.arithmetic_binary_type = void 0;
const expression_1 = require("../abstract/expression");
const error_1 = require("../system/error");
const type_1 = require("../system/type");
var arithmetic_binary_type;
(function (arithmetic_binary_type) {
    arithmetic_binary_type[arithmetic_binary_type["PLUS"] = 0] = "PLUS";
    arithmetic_binary_type[arithmetic_binary_type["MINUS"] = 1] = "MINUS";
    arithmetic_binary_type[arithmetic_binary_type["TIMES"] = 2] = "TIMES";
    arithmetic_binary_type[arithmetic_binary_type["DIV"] = 3] = "DIV";
    arithmetic_binary_type[arithmetic_binary_type["POWER"] = 4] = "POWER";
    arithmetic_binary_type[arithmetic_binary_type["MOD"] = 5] = "MOD";
})(arithmetic_binary_type = exports.arithmetic_binary_type || (exports.arithmetic_binary_type = {}));
class arithmetic_binary extends expression_1.expression {
    constructor(left, right, type, line, column) {
        super(line, column);
        this.left = left;
        this.right = right;
        this.type = type;
    }
    translate(environment) {
        throw new Error("Method not implemented.");
    }
    execute(environment) {
        const left_data = this.left.execute(environment);
        const right_data = this.right.execute(environment);
        const dominant_type = this.get_dominant_type(left_data.type, right_data.type);
        switch (this.type) {
            case arithmetic_binary_type.PLUS:
                switch (dominant_type) {
                    case type_1.type.STRING:
                        return { value: (left_data.value.toString() + right_data.value.toString()), type: type_1.type.STRING };
                    case type_1.type.INTEGER:
                        left_data.value = (left_data.type == type_1.type.CHAR) ? left_data.value.charCodeAt(0) : left_data.value;
                        right_data.value = (right_data.type == type_1.type.CHAR) ? right_data.value.charCodeAt(0) : right_data.value;
                        return { value: (left_data.value + right_data.value), type: type_1.type.INTEGER };
                    case type_1.type.FLOAT:
                        left_data.value = (left_data.type == type_1.type.CHAR) ? left_data.value.charCodeAt(0) : left_data.value;
                        right_data.value = (right_data.type == type_1.type.CHAR) ? right_data.value.charCodeAt(0) : right_data.value;
                        return { value: (left_data.value + right_data.value), type: type_1.type.FLOAT };
                    default:
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar: ' + left_data.type + ' + ' + right_data.type));
                }
                break;
            case arithmetic_binary_type.MINUS:
                switch (dominant_type) {
                    case type_1.type.INTEGER:
                        return { value: (left_data.value - right_data.value), type: type_1.type.INTEGER };
                    case type_1.type.FLOAT:
                        return { value: (left_data.value - right_data.value), type: type_1.type.FLOAT };
                    default:
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar: ' + left_data.type + ' - ' + right_data.type));
                }
                break;
            case arithmetic_binary_type.TIMES:
                switch (dominant_type) {
                    case type_1.type.INTEGER:
                        return { value: (left_data.value * right_data.value), type: type_1.type.INTEGER };
                    case type_1.type.FLOAT:
                        return { value: (left_data.value * right_data.value), type: type_1.type.FLOAT };
                    default:
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar: ' + left_data.type + ' * ' + right_data.type));
                }
                break;
            case arithmetic_binary_type.POWER:
                switch (dominant_type) {
                    case type_1.type.INTEGER:
                        return { value: (Math.pow(left_data.value, right_data.value)), type: type_1.type.INTEGER };
                    default:
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar: ' + left_data.type + ' ** ' + right_data.type));
                }
                break;
            case arithmetic_binary_type.MOD:
                switch (dominant_type) {
                    case type_1.type.INTEGER:
                        return { value: (left_data.value % right_data.value), type: type_1.type.INTEGER };
                    case type_1.type.FLOAT:
                        return { value: (left_data.value % right_data.value), type: type_1.type.FLOAT };
                    default:
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar: ' + left_data.type + ' % ' + right_data.type));
                }
                break;
            case arithmetic_binary_type.DIV:
                switch (dominant_type) {
                    case type_1.type.INTEGER:
                        if (right_data.value == 0) {
                            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, "No se puede dividir entre 0"));
                            break;
                        }
                        else
                            return { value: (left_data.value / right_data.value), type: type_1.type.INTEGER };
                    case type_1.type.FLOAT:
                        if (right_data.value == 0) {
                            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, "No se puede dividir entre 0"));
                            break;
                        }
                        else
                            return { value: (left_data.value / right_data.value), type: type_1.type.FLOAT };
                    default:
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar: ' + left_data.type + ' / ' + right_data.type));
                }
                break;
        }
        // Default
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports.arithmetic_binary = arithmetic_binary;
//# sourceMappingURL=arithmetic_binary.js.map