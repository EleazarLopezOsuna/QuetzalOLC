"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.declaration_struct = void 0;
const environment_1 = require("../system/environment");
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
const instruction_1 = require("../abstract/instruction");
const _struct_1 = require("../literal/_struct");
class declaration_struct extends instruction_1.instruction {
    constructor(variable_id, value, line, column) {
        super(line, column);
        this.variable_id = variable_id;
        this.value = value;
    }
    translate(current_environment) {
        // Save the variable 
        if (current_environment.get_variable(this.variable_id).type != type_1.type.UNDEFINED) {
            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Variable ya inicializada: ' + this.variable_id));
        }
        else {
            current_environment.save_variable(this.variable_id, { value: new _struct_1._struct(this.value, this.line, this.column),
                type: type_1.type.STRUCT }, console_1._3dCode.absolutePos, console_1._3dCode.relativePos, this.value.length);
            console_1._3dCode.absolutePos++;
            console_1._3dCode.relativePos++;
            let envi = new environment_1.environment(current_environment);
            envi.name = this.variable_id;
            let relativePos = console_1._3dCode.relativePos;
            console_1._3dCode.relativePos = 0;
            this.value.forEach(element => {
                envi.save_variable(element.id, { value: null, type: element.native_type }, console_1._3dCode.absolutePos, console_1._3dCode.relativePos, 1);
                console_1._3dCode.absolutePos++;
                console_1._3dCode.relativePos++;
            });
            console_1._3dCode.relativePos = relativePos;
            console_1._3dCode.environmentList.push(envi);
        }
        // Default
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