import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _console } from "../system/console";
import { literal } from "../abstract/literal";
import { instruction } from "../abstract/instruction";
import { _array } from "../literal/_array";
import { array_range } from "../expression/array_range";
import { variable_id } from "../literal/variable_id";
import { _struct } from "../literal/_struct";
import { struct_item } from "../literal/struct_item";

export class struct_access extends instruction {

    public translate(environment: environment): type {

        return type.NULL
    }

    constructor(public id: variable_id | struct_access, public property: string, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {

        const struct_data = this.id.execute(environment)
        if (struct_data.value instanceof struct_item) {
            let returned_object = struct_data.value.get_value(this.property, environment)
            if (returned_object != null) {
                return returned_object.execute(environment)
            } else {
                error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Propiedad no existente en el struct'));
                return { value: null, type: type.NULL }
            }
        } else {
            error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'La variable no es un struct'));
            return { value: null, type: type.NULL }
        }

    }

    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }
}