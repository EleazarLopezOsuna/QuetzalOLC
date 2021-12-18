"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.declaration_struct = void 0;
const expression_1 = require("../abstract/expression");
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const literal_1 = require("../abstract/literal");
const instruction_1 = require("../abstract/instruction");
const _struct_1 = require("../literal/_struct");
class declaration_struct extends instruction_1.instruction {
    constructor(variable_id, value, line, column) {
        super(line, column);
        this.variable_id = variable_id;
        this.value = value;
    }
    translate(environment) {
        if (this.value instanceof expression_1.expression || this.value instanceof literal_1.literal) {
            let valueType = this.value.translate(environment);
            return valueType;
        }
        else {
        }
        return type_1.type.NULL;
    }
    execute(environment) {
        // Save the variable 
        if (environment.get_variable(this.variable_id).type != type_1.type.UNDEFINED) {
            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Variable ya inicializada: ' + this.variable_id));
        }
        else {
            environment.save_variable(this.variable_id, { value: new _struct_1._struct(this.value, this.line, this.column), type: type_1.type.STRUCT }, 0, 0, 0);
        }
        // Default
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Lista de Declaraciones (" + this.variable_id + ")\"];";
        const this_count = count;
        const arr_list = [this.value];
        for (const instr_arr of arr_list) {
            for (const instr of instr_arr) {
                try {
                    result += "node" + this_count + " -> " + "node" + count + "1;";
                    result += instr.plot(Number(count + "1"));
                    count++;
                }
                catch (error) {
                    console.log(error);
                }
            }
        }
        return result;
    }
}
exports.declaration_struct = declaration_struct;
//# sourceMappingURL=declaration_struct.js.map