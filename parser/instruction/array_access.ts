import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _console } from "../system/console";
import { literal } from "../abstract/literal";
import { instruction } from "../abstract/instruction";
import { _array } from "../literal/_array";
import { array_range } from "../expression/array_range";

export class array_access extends instruction {

    public translate(environment: environment): type {
        throw new Error("Method not implemented.");
    }

    constructor(public id: string, public dimensions: Array<expression | literal | array_range>, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {

        let return_data = environment.get_variable(this.id)
        if (return_data.type != type.UNDEFINED) {
            if (return_data.value instanceof _array) {
                if(this.dimensions.length == 0) {
                    return return_data
                }
                // validate that the array have the correct dimensions
                if (!return_data.value.check_dimensions_number(this.dimensions)) {
                    error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Numero de dimensiones no validas para el array'));
                    return { value: null, type: type.NULL }
                }

                // and each have the correct length
                if (!return_data.value.check_dimensions_length(this.dimensions, environment)) {
                    error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Index no valido'));
                    return { value: null, type: type.NULL }
                }
                let returned = return_data.value.get(this.dimensions, environment)
                // Get the type from the symbols table
                if(returned.type == type.UNDEFINED){
                    returned.type = return_data.type
                }
                return returned
            } else {
                error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Variable no es un array: ' + this.id));
            }
        } else {
            error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Variable no definida: ' + this.id));
        }
        return { value: null, type: type.NULL }
    }

    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }
}