import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _console } from "../system/console";
import { literal } from "../abstract/literal";
import { instruction } from "../abstract/instruction";
import { _array } from "../literal/_array";
import { _struct } from "../literal/_struct";
import { struct_item } from "../literal/struct_item";

export class declaration_struct_item extends instruction {

    public translate(environment: environment): type {
        return type.NULL
    }

    constructor(public struct_id_array: Array<string>, public variable_id: string, public parameters: Array<expression | literal>, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        // check the struct types
        if (this.struct_id_array[0] != this.struct_id_array[1]) {
            error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede inicializar con diferente tipo de struct'));
            return { value: null, type: type.NULL }
        }

        // obtain struct definition
        let struct_definition = environment.get_variable(this.struct_id_array[0])
        if (struct_definition.type != type.STRUCT) {
            error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Struct no definido'));
            return { value: null, type: type.NULL }
        }

        // verify that have the correct number and correct type of parameter
        if (struct_definition.value instanceof _struct) {

            // validate that the array have the correct number of parameters
            if (!struct_definition.value.check_length(this.parameters)) {
                error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Numero de parametros no validas para el array'));
                return { value: null, type: type.NULL }
            }

            // and each have the correct types
            if (!struct_definition.value.check_types(this.parameters, environment)) {
                error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Parametro de tipo no valido'));
                return { value: null, type: type.NULL }
            }

            // Save the variable 
            if (environment.get_variable(this.variable_id).type != type.UNDEFINED) {
                error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Variable ya inicializada: ' + this.variable_id));
                return { value: null, type: type.NULL }
            } else {
                environment.save_variable(this.variable_id, { value: new struct_item(this.parameters, this.struct_id_array[0], this.line, this.column), type: type.STRUCT_ITEM }, 0, 0, 0)
            }

        }

        // create a new variable with this type of struct

        return { value: null, type: type.NULL }
    }

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Lista de Declaraciones (" + this.variable_id + ")\"];";
        const this_count = count
        for (const str of this.struct_id_array) {
            try {
                result += "node" + this_count + " -> " + "node" + count + "1;";
                result += "node" + Number(count + "1") + "[label=\"(" + this.line + "," + this.column + ") Declaracion (" + str + ")\"];";
                count++
            } catch (error) {
                console.log(error);
            }
        }
        const arr_list = [this.parameters]
        for (const instr_arr of arr_list) {
            for (const instr of instr_arr) {
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