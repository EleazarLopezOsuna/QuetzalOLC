"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.declaration_array = void 0;
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
const instruction_1 = require("../abstract/instruction");
class declaration_array extends instruction_1.instruction {
    constructor(type, variable_id, value, line, column) {
        super(line, column);
        this.type = type;
        this.variable_id = variable_id;
        this.value = value;
    }
    translate(environment) {
        if (this.value == null) {
            if (environment.get_variable(this.variable_id).type != type_1.type.UNDEFINED) {
            }
            else {
                console_1._3dCode.actualTemp++;
                console_1._3dCode.output += '//Array ' + this.variable_id + ' will be stored in stack, start position: ' + console_1._3dCode.relativePos + ' of this context\n';
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + ' + console_1._3dCode.relativePos + ';\n';
                console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = 0;\n';
                //Size is 0 because its just declaration without assignation of values
                environment.save_variable(this.variable_id, { value: this.value, type: this.type }, console_1._3dCode.absolutePos, console_1._3dCode.relativePos, 0);
                console_1._3dCode.absolutePos++;
                console_1._3dCode.relativePos++;
            }
        }
        else {
            console_1._3dCode.output += '//Array ' + this.variable_id + ' will be stored in stack, start position: ' + console_1._3dCode.relativePos + ' of this context\n';
            environment.save_variable(this.variable_id, { value: this.value, type: this.type }, console_1._3dCode.absolutePos, console_1._3dCode.relativePos, this.value.body.length);
            this.value.translateElements(environment);
        }
        // Default
        return type_1.type.NULL;
    }
    execute(environment) {
        // if is undefined save the variable with the type declared
        if (this.value == null) {
            // Save the variable 
            if (environment.get_variable(this.variable_id).type != type_1.type.UNDEFINED) {
                error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Variable ya inicializada: ' + this.variable_id));
            }
            else {
                environment.save_variable(this.variable_id, { value: this.value, type: this.type }, 0, 0, 0);
            }
        }
        // if the save variable has an expression check types
        else {
            // Checking both types
            let checked = this.value.checkType(this.type, environment);
            // if checked type save the variable
            if (!checked) {
                error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede iniciar con distinto tipo de dato para: ' + this.variable_id));
            }
            else {
                // Save the variable 
                if (environment.get_variable(this.variable_id).type != type_1.type.UNDEFINED) {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Variable ya inicializada: ' + this.variable_id));
                }
                else {
                    environment.save_variable(this.variable_id, { value: this.value, type: this.type }, 0, 0, 0);
                }
            }
        }
        // Default
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports.declaration_array = declaration_array;
//# sourceMappingURL=declaration_array.js.map