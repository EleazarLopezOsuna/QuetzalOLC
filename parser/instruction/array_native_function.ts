import { environment } from "../system/environment";
import { data, type } from "../system/type";
import { _console } from "../system/console";
import { instruction } from "../abstract/instruction";
import { parameter } from "../expression/parameter";
import { error, error_arr, error_type } from "../system/error";
import { expression } from "../abstract/expression";
import { _array } from "../literal/_array";
import { literal } from "../abstract/literal";
import { variable_id } from "../literal/variable_id";

export class array_native_function extends instruction {

    public translate(environment: environment): type {
        const return_data = this.id.execute(environment)
        if (!(return_data.value instanceof _array)) {
            error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Variable no es un array'));
            return type.NULL
        }
        switch (this.option) {
            case "pop":
                return return_data.type
            case "push":
                if (this.parameter == null) {
                    error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'El push no puede venir vacio'));
                    return type.NULL
                }
                const parameter_data = this.parameter.translate(environment)
                if (parameter_data != return_data.type) {
                    error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'El parametro tiene que ser del mismo tipo de dato que el array'));
                    return type.NULL
                }
                return_data.value.body.push(this.parameter)
                return parameter_data
        }
        // Default
        return type.NULL
    }

    constructor(public id: literal, public option: string, public parameter: expression | literal | null, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        const return_data = this.id.execute(environment)
        if (!(return_data.value instanceof _array)) {
            error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Variable no es un array'));
            return { value: null, type: type.NULL }
        }
        switch (this.option) {
            case "pop":
                let return_value = return_data.value.body.pop()
                if (return_value instanceof _array) {
                    return { value: return_value, type: return_data.type }
                } else if (return_value != null) {
                    return return_value.execute(environment)
                }
            case "push":
                if (this.parameter == null) {
                    error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'El push no puede venir vacio'));
                    return { value: null, type: type.NULL }
                }
                const parameter_data = this.parameter.execute(environment)
                if (parameter_data.type != return_data.type) {
                    error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'El parametro tiene que ser del mismo tipo de dato que el array'));
                    return { value: null, type: type.NULL }
                }
                return_data.value.body.push(this.parameter)
                return { value: parameter_data.value, type: parameter_data.type }
        }
        // Default
        return { value: null, type: type.NULL }
    }

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") While (" + this.id + "," + this.option + ")\"];";
        const this_count = count

        const child_list = [this.parameter]
        for (const instr of child_list) {
            if (instr != null) {
                try {
                    result += "node" + this_count + " -> " + "node" + count + "1;";
                    result += instr.plot(Number(count + "1"))
                    count++
                } catch (error) {
                    console.log(error);
                }
            }
        }
        return result
    }
}