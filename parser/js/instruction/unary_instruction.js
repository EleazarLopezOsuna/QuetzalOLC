"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unary_instruction = exports.unary_instruction_type = void 0;
const expression_1 = require("../abstract/expression");
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
var unary_instruction_type;
(function (unary_instruction_type) {
    unary_instruction_type[unary_instruction_type["INCREMENT"] = 0] = "INCREMENT";
    unary_instruction_type[unary_instruction_type["DECREMENT"] = 1] = "DECREMENT";
})(unary_instruction_type = exports.unary_instruction_type || (exports.unary_instruction_type = {}));
class unary_instruction extends expression_1.expression {
    constructor(variable_id, type, line, column) {
        super(line, column);
        this.variable_id = variable_id;
        this.type = type;
    }
    translate(environment) {
        const variable_data = environment.get_variable(this.variable_id);
        if (variable_data.type == type_1.type.NULL) {
            return type_1.type.NULL;
        }
        let absolutePos = environment.get_absolute_recursive(this.variable_id, environment);
        let relative = environment.get_relative_recursive(this.variable_id, environment);
        switch (this.type) {
            case unary_instruction_type.INCREMENT:
                switch (variable_data.type) {
                    case type_1.type.INTEGER:
                        let posVariable = console_1._3dCode.actualTemp++;
                        console_1._3dCode.output += 'T' + posVariable + ' = SP + ' + relative + ';\n';
                        console_1._3dCode.actualTemp++;
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = STACK[(int)T' + posVariable + '];//Get value of variable ' + this.variable_id + '\n';
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = T' + console_1._3dCode.actualTemp + ' + 1;\n';
                        console_1._3dCode.output += 'STACK[(int)T' + posVariable + '] = T' + console_1._3dCode.actualTemp + ';//Update value of variable ' + this.variable_id + '\n';
                        break;
                    default:
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar ++ para: ' + variable_data.value));
                }
                break;
            case unary_instruction_type.DECREMENT:
                switch (variable_data.type) {
                    case type_1.type.INTEGER:
                        let posVariable = console_1._3dCode.actualTemp++;
                        console_1._3dCode.output += 'T' + posVariable + ' = SP + ' + relative + ';\n';
                        console_1._3dCode.actualTemp++;
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = STACK[(int)T' + posVariable + '];//Get value of variable ' + this.variable_id + '\n';
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = T' + console_1._3dCode.actualTemp + ' - 1;\n';
                        console_1._3dCode.output += 'STACK[(int)T' + posVariable + '] = T' + console_1._3dCode.actualTemp + ';//Update value of variable ' + this.variable_id + '\n';
                        break;
                    default:
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar -- para: ' + variable_data.value));
                }
                break;
        }
        // Default
        return type_1.type.NULL;
    }
    execute(environment) {
        const variable_data = environment.get_variable(this.variable_id);
        if (variable_data.type == type_1.type.NULL) {
            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Variable no existente'));
            return { value: null, type: type_1.type.NULL };
        }
        switch (this.type) {
            case unary_instruction_type.INCREMENT:
                switch (variable_data.type) {
                    case type_1.type.INTEGER:
                        variable_data.value++;
                        break;
                    default:
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar ++ para: ' + variable_data.value));
                }
                break;
            case unary_instruction_type.DECREMENT:
                switch (variable_data.type) {
                    case type_1.type.INTEGER:
                        variable_data.value--;
                        break;
                    default:
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede operar -- para: ' + variable_data.value));
                }
                break;
        }
        // Default
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Continue (" + this.variable_id + "," + unary_instruction_type[this.type] + ")\"];";
        return result;
    }
}
exports.unary_instruction = unary_instruction;
//# sourceMappingURL=unary_instruction.js.map