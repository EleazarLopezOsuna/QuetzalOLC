"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignation_array = void 0;
const instruction_1 = require("../abstract/instruction");
const _array_1 = require("../literal/_array");
const error_1 = require("../system/error");
const type_1 = require("../system/type");
class assignation_array extends instruction_1.instruction {
    constructor(id, dimensions, expr, line, column) {
        super(line, column);
        this.id = id;
        this.dimensions = dimensions;
        this.expr = expr;
    }
    translate(environment) {
        // Default
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
        throw new Error("Method not implemented.");
    }
}
exports.assignation_array = assignation_array;
//# sourceMappingURL=assignation_array.js.map