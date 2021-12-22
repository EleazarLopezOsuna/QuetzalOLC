"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.array_native_function = void 0;
const type_1 = require("../system/type");
const console_1 = require("../system/console");
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
        const return_data = this.id.execute(environment);
        if (!(return_data.value instanceof _array_1._array)) {
            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'Variable no es un array'));
            return type_1.type.NULL;
        }
        let variable = this.id;
        switch (this.option) {
            case "pop":
                environment.pop_recursive(variable.id, environment);
                return return_data.type;
            case "push":
                if (this.parameter == null) {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'El push no puede venir vacio'));
                    return type_1.type.NULL;
                }
                const parameter_data = this.parameter.translate(environment);
                if (parameter_data != return_data.type) {
                    error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'El parametro tiene que ser del mismo tipo de dato que el array'));
                    return type_1.type.NULL;
                }
                this.parameter.translate(environment);
                environment.push_recursive(variable.id, environment, console_1._3dCode.actualTemp);
                return parameter_data;
        }
        // Default
        return type_1.type.NULL;
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
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") While (" + this.id + "," + this.option + ")\"];";
        const this_count = count;
        const child_list = [this.parameter];
        for (const instr of child_list) {
            if (instr != null) {
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
exports.array_native_function = array_native_function;
//# sourceMappingURL=array_native_function.js.map