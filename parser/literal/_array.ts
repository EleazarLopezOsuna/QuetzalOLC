import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _3dCode } from "../system/console";
import { literal } from "../abstract/literal";
import { array_range } from "../expression/array_range";

export class _array extends literal {
    public translate(environment: environment): type {
        // Default
        return type.NULL
    }

    constructor(public body: Array<expression | literal | array_range>, line: number, column: number) {
        super(line, column);
    }

    public check_dimensions_number(dimensions: Array<expression | literal | array_range>): boolean {
        let checked = false
        let body_pointer = this.body
        let dimensions_counter = 1
        let dimensions_index = 0
        while (dimensions_index < dimensions.length) {
            if (dimensions[dimensions_index] instanceof array_range) {
                dimensions_counter++
                dimensions_index++
            } else if (body_pointer[0] instanceof _array) {
                body_pointer = body_pointer[0].body
                dimensions_counter++
                dimensions_index++
            } else {
                dimensions_index++
            }
        }
        if (dimensions_index <= dimensions_counter) {
            checked = true
        }
        return checked
    }

    public check_dimensions_length(dimensions: Array<expression | literal | array_range>, environment: environment): boolean {
        let body_pointer = this.body
        let dimensions_index = 0
        while (dimensions_index < dimensions.length) {
            let dimension_data = dimensions[dimensions_index].execute(environment)
            if (dimension_data.value instanceof Array) {
                let first_index = (dimension_data.value[0] == "begin") ? 0 : dimension_data.value[0]
                let last_index = (dimension_data.value[1] == "end") ? (body_pointer.length - 1) : dimension_data.value[1]
                if(first_index < 0 || last_index >= body_pointer.length) {
                    return false
                }
                body_pointer = body_pointer.slice(first_index, last_index + 1)
                dimensions_index++
            } else if (body_pointer[0] instanceof _array) {
                if (dimension_data.value < 0 || dimension_data.value >= body_pointer.length) {
                    return false
                }
                body_pointer = body_pointer[0].body
                dimensions_index++
            } else {
                if (dimension_data.value < 0 || dimension_data.value >= body_pointer.length) {
                    return false
                }
                dimensions_index++
            }
        }
        return true
    }


    public get(dimensions: Array<expression | literal | array_range>, environment: environment): data {
        // get first data 
        let dimension_data = dimensions[0].execute(environment)
        dimensions.shift()

        // if the dimension is a range obtain by range
        if (dimension_data.value instanceof Array) {
            let first_index = (dimension_data.value[0] == "begin") ? 0 : dimension_data.value[0]
            let last_index = (dimension_data.value[1] == "end") ? (this.body.length - 1) : dimension_data.value[1]
            let arr_return = new _array(this.body.slice(first_index, last_index + 1), this.line, this.column)
            if (dimensions.length > 0) {
                return arr_return.get(dimensions, environment)
            } else {
                return { type: type.UNDEFINED, value: arr_return }
            }
        } else {
            // iterate trought the array and return the value
            let item = this.body[dimension_data.value]
            if (item instanceof _array && dimensions.length > 0) {
                return item.get(dimensions, environment)
            } else {
                return item.execute(environment)
            }
        }
    }

    public checkType(type: type, environment: environment): boolean {
        let return_bool = true;
        for (const item of this.body) {
            if (item instanceof _array) {
                return_bool = item.checkType(type, environment)
                // if one of all elements have another type return false
                if (!return_bool) return false;
            } else {
                return_bool = (item.execute(environment).type == type)
                // if one of all elements have another type return false
                if (!return_bool) return false;
            }
        }
        return return_bool;
    }

    public translateElements(environment: environment){
        for(const item of this.body){
            if(item instanceof _array){
                item.translateElements(environment)
            } else {
                item.translate(environment)
            }
        }
    }

    public to_string(environment: environment): string {
        let result_str = "["
        for (const item of this.body) {
            if (item instanceof _array) {
                result_str += item.to_string(environment) + ","
            } else {
                result_str += item.execute(environment).value + ","
            }
        }
        // remove comma
        result_str = result_str.substring(0, result_str.length - 1)
        return result_str + "]"
    }

    public execute(environment: environment): data {
        // Default
        return { value: this, type: type.UNDEFINED }
    }

    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }
}