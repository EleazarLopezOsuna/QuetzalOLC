"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignation_array = void 0;
const instruction_1 = require("../abstract/instruction");
const _array_1 = require("../literal/_array");
const console_1 = require("../system/console");
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const _symbol_1 = require("../system/_symbol");
class assignation_array extends instruction_1.instruction {
    constructor(id, dimensions, expr, line, column) {
        super(line, column);
        this.id = id;
        this.dimensions = dimensions;
        this.expr = expr;
    }
    translate(environment) {
        if (this.dimensions == null) {
            let return_data = environment.get_variable_recursive(this.id, environment);
            environment.modifySize_recursive(this.id, environment, 0);
        }
        else {
            let return_data = environment.get_variable_recursive(this.id, environment);
            let symScope = environment.get_scope_recursive(this.id, environment);
            this.expr.translate(environment);
            let exprTemp = console_1._3dCode.actualTemp;
            let tempList = [];
            if (return_data.type != type_1.type.UNDEFINED) {
                if (return_data.value instanceof _array_1._array) {
                    for (let dimension of this.dimensions) {
                        dimension.translate(environment);
                        tempList.push(console_1._3dCode.actualTemp);
                    }
                    console_1._3dCode.actualTemp++;
                    let uno = console_1._3dCode.actualTemp;
                    console_1._3dCode.actualTemp++;
                    let dos = console_1._3dCode.actualTemp;
                    for (let i = 0; i < tempList.length; i++) {
                        if (i == 0)
                            console_1._3dCode.output += 'T' + uno + ' = T' + tempList[i] + ';\n';
                        else {
                            console_1._3dCode.output += 'T' + dos + ' = T' + uno + ' * ' + return_data.value.dimensionSize.get(i) + ';\n';
                            console_1._3dCode.output += 'T' + uno + ' = T' + dos + ' + T' + tempList[i] + ';\n';
                        }
                    }
                    console_1._3dCode.actualTemp++;
                    if (symScope == _symbol_1.scope.GLOBAL) {
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = mainStart + ' + environment.get_relative_recursive(this.id, environment) + ';//Set array initial position\n';
                    }
                    else {
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + ' + environment.get_relative_recursive(this.id, environment) + ';//Set array initial position\n';
                    }
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = T' + console_1._3dCode.actualTemp + ' + T' + uno + ';//Add index\n';
                    console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + ']' + ' = T' + exprTemp + ';//Get value\n';
                }
            }
            else {
                error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Variable no inicializada'));
            }
        }
        return type_1.type.NULL;
    }
    execute(environment) {
        const expr_data = this.expr.execute(environment);
        // validate that exists
        let saved_variable = environment.get_variable(this.id);
        if (saved_variable.type != type_1.type.UNDEFINED) {
            // 
            if (saved_variable.value instanceof _array_1._array) {
                if (this.dimensions.length == 0) {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Numero de dimensiones no validas para el array'));
                }
                // validate that the array have the correct dimensions
                if (!saved_variable.value.check_dimensions_number(this.dimensions)) {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Numero de dimensiones no validas para el array'));
                    return { value: null, type: type_1.type.NULL };
                }
                // and each have the correct length
                if (!saved_variable.value.check_dimensions_length(this.dimensions, environment)) {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Index no valido'));
                    return { value: null, type: type_1.type.NULL };
                }
                // validate the type
                if (saved_variable.type == expr_data.type) {
                    // change the data in the array
                    if (!saved_variable.value.assign_value(this.dimensions, environment, this.expr)) {
                        error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Error al asignar valor al array'));
                    }
                }
                else {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Tipo diferente, no se puede asignar'));
                }
            }
        }
        else {
            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Variable no inicializada'));
        }
        // Default
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Assignacion de Array\"];";
        const this_count = count;
        const child_list = [this.expr];
        for (const instr of child_list) {
            try {
                result += "node" + this_count + " -> " + "node" + count + "1;";
                result += instr.plot(Number(count + "1"));
                count++;
            }
            catch (error) {
                console.log(error);
            }
        }
        for (const instr of this.dimensions) {
            try {
                result += "node" + this_count + " -> " + "node" + count + "1;";
                result += instr.plot(Number(count + "1"));
                count++;
            }
            catch (error) {
                console.log(error);
            }
        }
        return result;
    }
}
exports.assignation_array = assignation_array;
//# sourceMappingURL=assignation_array.js.map