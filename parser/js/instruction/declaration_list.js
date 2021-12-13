"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.declaration_list = void 0;
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
const instruction_1 = require("../abstract/instruction");
class declaration_list extends instruction_1.instruction {
    constructor(native_type, declare_list, line, column) {
        super(line, column);
        this.native_type = native_type;
        this.declare_list = declare_list;
    }
    translate(environment) {
        let tData = { value: null, type: type_1.type.NULL };
        this.declare_list.forEach(item => {
            let itemType = item.translate(environment);
            let itemTemp = console_1._3dCode.actualTemp;
            tData.type = itemType;
            if (itemType == type_1.type.NULL) {
                if (environment.get_variable(item.variable_id).type != type_1.type.NULL) {
                }
                else {
                    console_1._3dCode.output += 'STACK[' + console_1._3dCode.absolutePos + '] = 0;//Save variable ' + item.variable_id + '\n';
                    environment.save_variable(item.variable_id, tData, console_1._3dCode.absolutePos, console_1._3dCode.relativePos, 1);
                    console_1._3dCode.absolutePos++;
                    console_1._3dCode.relativePos++;
                }
                return type_1.type.NULL;
            }
            else {
                let checked = false;
                if (itemType == this.native_type) {
                    checked = true;
                }
                if (!checked) {
                }
                else {
                    if (environment.get_variable(item.variable_id).type != type_1.type.NULL) {
                    }
                    else {
                        console_1._3dCode.output += 'STACK[' + console_1._3dCode.absolutePos + '] = T' + itemTemp + ';//Save variable ' + item.variable_id + '\n';
                        environment.save_variable(item.variable_id, tData, console_1._3dCode.absolutePos, console_1._3dCode.relativePos, 1);
                        console_1._3dCode.absolutePos++;
                        console_1._3dCode.relativePos++;
                    }
                }
            }
        });
        // Default
        return type_1.type.NULL;
    }
    add_to_list(item) {
        this.declare_list.push(item);
    }
    execute(environment) {
        this.declare_list.forEach(item => {
            let item_data = item.execute(environment);
            // if is equal null save the variable with the type declared
            if (item_data.type == type_1.type.NULL) {
                // Save the variable 
                if (environment.get_variable(item.variable_id).type != type_1.type.UNDEFINED) {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Variable ya inicializada: ' + item.variable_id));
                }
                else {
                    environment.save_variable(item.variable_id, item_data, console_1._console.absolutePos, console_1._console.relativePos, 1);
                    console_1._console.absolutePos++;
                    console_1._console.relativePos++;
                }
                return;
            }
            // if the save variable has an expression check types
            else {
                // Checking both types
                let checked = false;
                if (item_data.type == this.native_type) {
                    checked = true;
                }
                // if checked type save the variable
                if (!checked) {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'No se puede iniciar con distinto tipo de dato para: ' + item.variable_id));
                }
                else {
                    // Save the variable 
                    if (environment.get_variable(item.variable_id).type != type_1.type.UNDEFINED) {
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Variable ya inicializada: ' + item.variable_id));
                    }
                    else {
                        environment.save_variable(item.variable_id, item_data, console_1._console.absolutePos, console_1._console.relativePos, 1);
                        console_1._console.absolutePos++;
                        console_1._console.relativePos++;
                    }
                }
            }
        });
        // Default
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports.declaration_list = declaration_list;
//# sourceMappingURL=declaration_list.js.map