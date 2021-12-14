"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.array_native_function = void 0;
const type_1 = require("../system/type");
const instruction_1 = require("../abstract/instruction");
const error_1 = require("../system/error");
const _array_1 = require("../literal/_array");
class array_native_function extends instruction_1.instruction {
    constructor(id, option, parameter, line, column) {
        super(line, column);
        this.id = id;
        this.option = option;
        this.parameter = parameter;
    }
    translate(environment) {
        throw new Error("Method not implemented.");
    }
    execute(environment) {
        const return_data = this.id.execute(environment);
        if (!(return_data.value instanceof _array_1._array)) {
            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Variable no es un array'));
            return { value: null, type: type_1.type.NULL };
        }
        switch (this.option) {
            case "pop":
                let return_value = return_data.value.body.pop();
                if (return_value instanceof _array_1._array) {
                    return { value: return_value, type: return_data.type };
                }
                else if (return_value != null) {
                    return return_value.execute(environment);
                }
            case "push":
                if (this.parameter == null) {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'El push no puede venir vacio'));
                    return { value: null, type: type_1.type.NULL };
                }
                const parameter_data = this.parameter.execute(environment);
                if (parameter_data.type != return_data.type) {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'El parametro tiene que ser del mismo tipo de dato que el array'));
                    return { value: null, type: type_1.type.NULL };
                }
                return_data.value.body.push(this.parameter);
                return { value: parameter_data.value, type: parameter_data.type };
        }
        // Default
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports.array_native_function = array_native_function;
//# sourceMappingURL=array_native_function.js.map