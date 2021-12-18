"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.array_access = void 0;
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
const instruction_1 = require("../abstract/instruction");
const _array_1 = require("../literal/_array");
class array_access extends instruction_1.instruction {
    constructor(id, dimensions, line, column) {
        super(line, column);
        this.id = id;
        this.dimensions = dimensions;
    }
    translate(environment) {
        let return_data = environment.get_variable(this.id);
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
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + ' + environment.get_relative(this.id) + ';//Set array initial position\n';
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = T' + console_1._3dCode.actualTemp + ' + T' + uno + ';//Add index\n';
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = STACK[(int)T' + console_1._3dCode.actualTemp + '];//Get value\n';
                return return_data.type;
            }
            else {
            }
        }
        else {
        }
        return type_1.type.NULL;
    }
    execute(environment) {
        let return_data = environment.get_variable(this.id);
        if (return_data.type != type_1.type.UNDEFINED) {
            if (return_data.value instanceof _array_1._array) {
                if (this.dimensions.length == 0) {
                    return return_data;
                }
                // validate that the array have the correct dimensions
                if (!return_data.value.check_dimensions_number(this.dimensions)) {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Numero de dimensiones no validas para el array'));
                    return { value: null, type: type_1.type.NULL };
                }
                // and each have the correct length
                if (!return_data.value.check_dimensions_length(this.dimensions, environment)) {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Index no valido'));
                    return { value: null, type: type_1.type.NULL };
                }
                let returned = return_data.value.get(this.dimensions, environment);
                // Get the type from the symbols table
                if (returned.type == type_1.type.UNDEFINED) {
                    returned.type = return_data.type;
                }
                return returned;
            }
            else {
                error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Variable no es un array: ' + this.id));
            }
        }
        else {
            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Variable no definida: ' + this.id));
        }
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") While (" + this.id + ")\"];";
        const this_count = count;
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
exports.array_access = array_access;
//# sourceMappingURL=array_access.js.map