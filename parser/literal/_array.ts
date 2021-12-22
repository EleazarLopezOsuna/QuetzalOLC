import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _3dCode } from "../system/console";
import { literal } from "../abstract/literal";
import { array_range } from "../expression/array_range";

export class _array extends literal {
    public dimensionSize;
    public size;

    public translate(environment: environment): type {
        // Default
        return type.NULL
    }

    constructor(public body: Array<expression | literal | array_range>, line: number, column: number) {
        super(line, column);
        this.dimensionSize = new Map<number, number>();
        this.size = 0;
    }

    public assign_value(dimensions: Array<expression | literal | array_range>, environment: environment, expr: expression | literal) {
        let body_pointer = this.body
        let dimensions_index = 0
        let dimension_data: data = { type: type.UNDEFINED, value: null }
        while (dimensions_index < dimensions.length) {
            dimension_data = dimensions[dimensions_index].execute(environment)
            if (dimension_data.value instanceof Array) {
                return false
            } else if (body_pointer[0] instanceof _array) {
                let item = body_pointer[dimension_data.value]
                if (item instanceof _array) {
                    body_pointer = item.body
                } else {
                    return false
                }
                dimensions_index++
            } else {
                dimensions_index++
            }
        }
        if (dimension_data.type != type.UNDEFINED) {
            body_pointer[dimension_data.value] = expr
        }
        return true
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
                if (first_index < 0 || last_index >= body_pointer.length) {
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


    public get(dimensions_index: number,dimensions: Array<expression | literal | array_range>, environment: environment): data {
        let body_pointer = this.body
        while (dimensions_index < dimensions.length) {
            let dimension_data = dimensions[dimensions_index].execute(environment)
            if (dimension_data.value instanceof Array) {
                let first_index = (dimension_data.value[0] == "begin") ? 0 : dimension_data.value[0]
                let last_index = (dimension_data.value[1] == "end") ? (body_pointer.length - 1) : dimension_data.value[1]
                let arr_return = new _array(this.body.slice(first_index, last_index + 1), this.line, this.column)
                if (dimensions_index + 1 < dimensions.length) {
                    return arr_return.get(dimensions_index + 1,dimensions, environment)
                } else {
                    return { type: type.UNDEFINED, value: arr_return }
                }
            }  else {
                // iterate trought the array and return the value
                let item = this.body[dimension_data.value]
                if (item instanceof _array && (dimensions_index + 1 < dimensions.length)) {
                    return item.get(dimensions_index + 1,dimensions, environment)
                } else {
                    return item.execute(environment)
                }
            }
        }
        return { type: type.UNDEFINED, value: null }

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

    public translateElements(environment: environment, dimension: number) {
        let contador = 0;
        for (const item of this.body) {
            if (item instanceof _array) {
                item.translateElements(environment, dimension + 1)
                item.dimensionSize.forEach((values, keys) => {
                    if (this.dimensionSize.has(keys)) {
                        let dimSize = this.dimensionSize.get(keys) as number
                        if (dimSize < values) {
                            this.dimensionSize.set(keys, values)
                        }
                    } else {
                        this.dimensionSize.set(keys, values);
                    }
                })
            } else {
                item.translate(environment);
                let itemTemp = _3dCode.actualTemp;
                _3dCode.actualTemp++;
                _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP + ' + _3dCode.relativePos + ';\n';
                _3dCode.output += 'STACK[(int)T' + _3dCode.actualTemp + '] = T' + itemTemp + ';//Save value in array, index ' + contador + '\n';
                _3dCode.absolutePos++;
                _3dCode.relativePos++;
            }
            contador++;
        }
        if (this.dimensionSize.has(dimension)) {
            let dimSize = this.dimensionSize.get(dimension) as number
            if (dimSize < dimension) {
                this.dimensionSize.set(dimension, contador)
            }
        } else {
            this.dimensionSize.set(dimension, contador);
        }
    }

    public getTotalItems(): number {
        let retorno = 0;
        this.dimensionSize.forEach((values, keys) => {
            let dimSize = this.dimensionSize.get(keys) as number
            retorno += dimSize;
        })
        return retorno
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
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Array\"];";
        const this_count = count

        for (const instr of this.body) {
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