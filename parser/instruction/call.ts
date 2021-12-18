import { environment } from "../system/environment";
import { data, type } from "../system/type";
import { _console } from "../system/console";
import { instruction } from "../abstract/instruction";
import { expression } from "../abstract/expression";
import { error, error_arr, error_type } from "../system/error";
import { _return } from "./_return";

export class call extends instruction {

    public translate(environment: environment): type {
        throw new Error("Method not implemented.");
    }

    constructor(public id: string, public parameters: Array<expression>, line: number, column: number) {
        super(line, column);
    }

    public execute(current_environment: environment): data {
        // the new environment to execute
        const new_environment = new environment(current_environment);
        // Obtain the function
        let function_to_execute = current_environment.get_function(this.id);
        if (function_to_execute != null) {
            // check the type of the parameters to save them in a new environment
            if (this.parameters.length == function_to_execute.parameters.length) {
                for (let index = 0; index < this.parameters.length; index++) {
                    const call_parameter = this.parameters[index];
                    const call_parameter_data = call_parameter.execute(current_environment)
                    if (call_parameter_data.type == function_to_execute.parameters[index].native_type) {
                        new_environment.save_variable(function_to_execute.parameters[index].id, call_parameter_data, 0, 0, 0)
                    } else {
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Tipo de parametro incorrecto'));
                    }
                }
                // execute the code in the new environmet
                let return_data = { value: null, type: type.NULL }
                function_to_execute.code.forEach(instr => {
                    if (instr instanceof _return) {
                        return_data = instr.execute(new_environment)
                        return;
                    } else {
                        instr.execute(new_environment)
                    }
                });
                // If the type is different to void check the return
                if ((function_to_execute.native_type != type.VOID && function_to_execute.native_type != return_data.type)
                    || (function_to_execute.native_type == type.VOID && type.NULL != return_data.type)) {
                    error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Return de tipo incorrecto'));
                } else {
                    return return_data
                }
            } else {
                error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Numero de parametros incorrecto'));
            }

        } else {
            error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'La funcion no existe: ' + this.id));
        }
        // Default
        return { value: null, type: type.NULL }
    }

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Llamada (" + this.id + ")\"];";
        const this_count = count

        for (const instr of this.parameters) {
            try {
                result += "node" + this_count + " -> " + "node" + count + "1;";
                result += instr.plot(Number(count + "1"))
                count++
            } catch (error) {
                console.log(error);
            }
        }
        return result
    }
}